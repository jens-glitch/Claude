import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Simple geocoding function using Nominatim (OpenStreetMap)
async function geocodeAddress(address: string, city: string, postalCode: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, ${postalCode} ${city}, Sweden`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          'User-Agent': 'ApartmentExchange/1.0'
        }
      }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      address,
      city,
      postalCode,
      rooms,
      rent,
      size,
      hasBalcony,
      hasElevator,
      hasFireplace,
      hasParking,
      hasDishwasher,
      hasWashingMachine,
      petsAllowed,
      description,
    } = body;

    // Geocode the address
    const coords = await geocodeAddress(address, city, postalCode);

    if (!coords) {
      return NextResponse.json(
        { error: "Kunde inte hitta adressen. Kontrollera att den är korrekt." },
        { status: 400 }
      );
    }

    // Check if user already has an apartment
    const existingApartment = await prisma.apartment.findFirst({
      where: { userId: session.user.id },
    });

    let apartment;

    if (existingApartment) {
      // Update existing apartment
      apartment = await prisma.apartment.update({
        where: { id: existingApartment.id },
        data: {
          address,
          city,
          postalCode,
          latitude: coords.lat,
          longitude: coords.lon,
          rooms: parseInt(rooms),
          rent: parseFloat(rent),
          size: size ? parseFloat(size) : null,
          hasBalcony: !!hasBalcony,
          hasElevator: !!hasElevator,
          hasFireplace: !!hasFireplace,
          hasParking: !!hasParking,
          hasDishwasher: !!hasDishwasher,
          hasWashingMachine: !!hasWashingMachine,
          petsAllowed: !!petsAllowed,
          description,
        },
      });
    } else {
      // Create new apartment
      apartment = await prisma.apartment.create({
        data: {
          userId: session.user.id,
          address,
          city,
          postalCode,
          latitude: coords.lat,
          longitude: coords.lon,
          rooms: parseInt(rooms),
          rent: parseFloat(rent),
          size: size ? parseFloat(size) : null,
          hasBalcony: !!hasBalcony,
          hasElevator: !!hasElevator,
          hasFireplace: !!hasFireplace,
          hasParking: !!hasParking,
          hasDishwasher: !!hasDishwasher,
          hasWashingMachine: !!hasWashingMachine,
          petsAllowed: !!petsAllowed,
          description,
        },
      });
    }

    return NextResponse.json(apartment, { status: existingApartment ? 200 : 201 });
  } catch (error) {
    console.error("Apartment create/update error:", error);
    return NextResponse.json(
      { error: "Något gick fel vid sparande av lägenheten" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    const apartment = await prisma.apartment.findFirst({
      where: { userId: session.user.id },
      include: {
        floorPlan: {
          include: {
            rooms: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Apartment fetch error:", error);
    return NextResponse.json(
      { error: "Något gick fel vid hämtning av lägenhet" },
      { status: 500 }
    );
  }
}
