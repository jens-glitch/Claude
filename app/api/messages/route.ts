import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all conversations and messages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get("userId");

    if (otherUserId) {
      // Get messages with a specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.user.id },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: session.user.id,
          senderId: otherUserId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json(messages);
    } else {
      // Get all conversations
      const sentMessages = await prisma.message.findMany({
        where: { senderId: session.user.id },
        select: { receiverId: true },
        distinct: ['receiverId'],
      });

      const receivedMessages = await prisma.message.findMany({
        where: { receiverId: session.user.id },
        select: { senderId: true },
        distinct: ['senderId'],
      });

      const userIds = [
        ...new Set([
          ...sentMessages.map((m) => m.receiverId),
          ...receivedMessages.map((m) => m.senderId),
        ]),
      ];

      const conversations = await Promise.all(
        userIds.map(async (userId) => {
          const lastMessage = await prisma.message.findFirst({
            where: {
              OR: [
                { senderId: session.user.id, receiverId: userId },
                { senderId: userId, receiverId: session.user.id },
              ],
            },
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
              receiver: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          const unreadCount = await prisma.message.count({
            where: {
              senderId: userId,
              receiverId: session.user.id,
              read: false,
            },
          });

          const otherUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              name: true,
            },
          });

          return {
            user: otherUser,
            lastMessage,
            unreadCount,
          };
        })
      );

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}

// Send a message
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
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Mottagare och innehåll krävs" },
        { status: 400 }
      );
    }

    // Check if both users have mutual interest
    const myApartment = await prisma.apartment.findFirst({
      where: { userId: session.user.id },
    });

    const theirApartment = await prisma.apartment.findFirst({
      where: { userId: receiverId },
    });

    if (!myApartment || !theirApartment) {
      return NextResponse.json(
        { error: "Båda användare måste ha en lägenhet" },
        { status: 400 }
      );
    }

    // Check mutual interest
    const myInterest = await prisma.interest.findUnique({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId: theirApartment.id,
        },
      },
    });

    const theirInterest = await prisma.interest.findUnique({
      where: {
        userId_apartmentId: {
          userId: receiverId,
          apartmentId: myApartment.id,
        },
      },
    });

    if (!myInterest || !theirInterest) {
      return NextResponse.json(
        { error: "Ni måste båda ha markerat intresse för varandras lägenheter för att chatta" },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}
