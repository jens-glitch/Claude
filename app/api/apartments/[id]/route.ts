import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        floorPlan: {
          include: {
            rooms: true,
          },
        },
      },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: "Lägenheten hittades inte" },
        { status: 404 }
      );
    }

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Get apartment error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}
