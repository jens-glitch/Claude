import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const minRooms = searchParams.get("minRooms");
    const maxRooms = searchParams.get("maxRooms");
    const minRent = searchParams.get("minRent");
    const maxRent = searchParams.get("maxRent");
    const hasBalcony = searchParams.get("hasBalcony") === "true";
    const hasElevator = searchParams.get("hasElevator") === "true";
    const hasFireplace = searchParams.get("hasFireplace") === "true";
    const hasParking = searchParams.get("hasParking") === "true";
    const hasDishwasher = searchParams.get("hasDishwasher") === "true";
    const hasWashingMachine = searchParams.get("hasWashingMachine") === "true";
    const petsAllowed = searchParams.get("petsAllowed") === "true";
    const city = searchParams.get("city");

    // Build where clause
    const where: any = {};

    if (minRooms) {
      where.rooms = { ...where.rooms, gte: parseInt(minRooms) };
    }
    if (maxRooms) {
      where.rooms = { ...where.rooms, lte: parseInt(maxRooms) };
    }
    if (minRent) {
      where.rent = { ...where.rent, gte: parseFloat(minRent) };
    }
    if (maxRent) {
      where.rent = { ...where.rent, lte: parseFloat(maxRent) };
    }
    if (hasBalcony) {
      where.hasBalcony = true;
    }
    if (hasElevator) {
      where.hasElevator = true;
    }
    if (hasFireplace) {
      where.hasFireplace = true;
    }
    if (hasParking) {
      where.hasParking = true;
    }
    if (hasDishwasher) {
      where.hasDishwasher = true;
    }
    if (hasWashingMachine) {
      where.hasWashingMachine = true;
    }
    if (petsAllowed) {
      where.petsAllowed = true;
    }
    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      };
    }

    const apartments = await prisma.apartment.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        images: {
          take: 1,
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            interests: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(apartments);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Något gick fel vid sökning" },
      { status: 500 }
    );
  }
}
