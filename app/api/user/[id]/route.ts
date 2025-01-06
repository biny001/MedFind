/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import getSession from "@/lib/getuserSession";
import { prisma } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const userSession = await getSession();

    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        adminId: userSession.user.id,
      },
    });

    console.log(pharmacy);

    const isInArray = pharmacy?.admins.find((adminId) => adminId === id);

    if (!isInArray) throw new Error("user does not exist");

    if (!pharmacy) throw new Error("only owners are able to delete admins");

    const updatedPharmacy = await prisma.pharmacy.update({
      where: {
        id: pharmacy.id,
      },
      data: {
        admins: {
          set: pharmacy.admins.filter((adminId) => adminId !== id),
        },
      },
    });

    if (!updatedPharmacy) throw Error("unable to delete user");

    const userDeleted = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    if (!userDeleted) throw Error("unable to delete user");

    return NextResponse.json("pharmacy deleted successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Couldn't delete pharmacy" },
      { status: 500 }
    );
  }
}
