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

    const pharmacy = await prisma.pharmacy.findMany();

    if (!pharmacy) {
      return new Response(JSON.stringify({}), { status: 404 });
    }

    return new Response(JSON.stringify(pharmacy), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};

export const PATCH = async function (request: Request) {
  try {
    const pharmacyId = await request.json();
    const userSession = await getSession();

    if (!userSession || userSession.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!pharmacyId) {
      return new Response("Pharmacy ID is required", { status: 400 });
    }

    const pharmacy = await prisma.pharmacy.update({
      where: {
        id: pharmacyId,
      },
      data: {
        approvalStatus: "APPROVED",
      },
    });

    if (pharmacy.adminId !== null) {
      const user = await prisma.user.findFirst({
        where: {
          id: pharmacy.adminId,
        },
      });

      if (user) {
        await sendMail({
          to: user.email,
          subject: "Pharmacy Approval",
          text: "Your pharmacy has been approved",
        });
      }
    }

    return new Response(JSON.stringify(pharmacy), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};
