import { prisma } from "@/lib/auth";
import getSession from "@/lib/getuserSession";

export interface SessionData {
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    userAgent: string;
    userId: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null; // Adjust the type to match the response
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string;
    approved?: string;
  };
}

export const POST = async function (request: Request) {
  try {
    const userSession = await getSession();

    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Type assertion to SessionData, since `getSession` guarantees `userSession` is not null here
    const typedSession: SessionData = userSession as SessionData;

    // const pharmacy = await prisma.pharmacy.create({
    //   data: {
    //     name: "HealthFirst Pharmacy",
    //     location: "123 Main Street, Springfield",
    //     contactInfo: "+1-555-123-4567",
    //     adminId: typedSession.user.id, // Reference to the primary admin's User ID
    //     admins: [typedSession.user.id], // Add the primary admin to the array
    //     approvalStatus: "PENDING",
    //   },
    // });

    return new Response("Pharmacy created successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};
