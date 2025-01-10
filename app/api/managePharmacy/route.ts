/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/auth";
import cloudinary from "@/lib/config";
import getSession from "@/lib/getuserSession";
import sendMail from "@/lib/nodeMailer";

export const GET = async function (request: Request) {
  try {
    const userSession = await getSession();

    if (!userSession || userSession.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const pharmacies = await prisma.pharmacy.findMany({
      include: {
        admin: {
          // Access the admin relationship
          select: {
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sort by newest first
      },
    });

    if (!pharmacies || pharmacies.length === 0) {
      return new Response(JSON.stringify({}), { status: 404 });
    }

    return new Response(JSON.stringify(pharmacies), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};
