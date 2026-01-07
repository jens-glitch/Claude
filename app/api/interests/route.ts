import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all interests for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    // Get apartments the user is interested in
    const myInterests = await prisma.interest.findMany({
      where: { userId: session.user.id },
      include: {
        apartment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            images: {
              take: 1,
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    // Get users interested in my apartment
    const myApartment = await prisma.apartment.findFirst({
      where: { userId: session.user.id },
    });

    let interestedInMyApartment = [];
    if (myApartment) {
      interestedInMyApartment = await prisma.interest.findMany({
        where: { apartmentId: myApartment.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          apartment: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    // Find mutual matches
    const mutualMatches = myInterests.filter((interest) => {
      return interestedInMyApartment.some(
        (otherInterest) => otherInterest.userId === interest.apartment.userId
      );
    });

    return NextResponse.json({
      myInterests,
      interestedInMyApartment,
      mutualMatches,
      myApartmentId: myApartment?.id || null,
    });
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}

// Toggle interest in an apartment
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
    const { apartmentId } = body;

    if (!apartmentId) {
      return NextResponse.json(
        { error: "Lägenhet ID krävs" },
        { status: 400 }
      );
    }

    // Check if user is trying to like their own apartment
    const apartment = await prisma.apartment.findUnique({
      where: { id: apartmentId },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: "Lägenheten finns inte" },
        { status: 404 }
      );
    }

    if (apartment.userId === session.user.id) {
      return NextResponse.json(
        { error: "Du kan inte markera intresse för din egen lägenhet" },
        { status: 400 }
      );
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findUnique({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId,
        },
      },
    });

    if (existingInterest) {
      // Remove interest
      await prisma.interest.delete({
        where: { id: existingInterest.id },
      });

      return NextResponse.json({ interested: false });
    } else {
      // Add interest
      await prisma.interest.create({
        data: {
          userId: session.user.id,
          apartmentId,
        },
      });

      return NextResponse.json({ interested: true });
    }
  } catch (error) {
    console.error("Toggle interest error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}
