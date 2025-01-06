/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/auth";
import getSession from "@/lib/getuserSession";
import sendMail from "@/lib/nodeMailer";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const userSession = await getSession();

    if (!userSession || userSession.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!id) {
      return new Response("Pharmacy ID is required", { status: 400 });
    }

    const pharmacy = await prisma.pharmacy.update({
      where: {
        id: id,
      },
      data: {
        approvalStatus: "APPROVED",
      },
    });

    if (!pharmacy) throw new Error("pharmacy not found");

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
}
