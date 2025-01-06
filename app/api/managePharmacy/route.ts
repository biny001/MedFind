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
