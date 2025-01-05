import { NextResponse } from "next/server";
import getSession from "@/lib/getuserSession";
import { prisma } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const medicineData = await request.json();

    const userSession = await getSession();

    if (!userSession) return new NextResponse("unauthorized", { status: 401 });
    if (!medicineData) throw Error("medicine Data should be provided");

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { adminId: userSession.user.id }, // Match by adminId
          { admins: { has: userSession.user.id } }, // Match by presence in the admins array
        ],
      },
    });

    if (!pharmacy) throw new Error("unable to get pharmacy");

    const medicine = await prisma.medicine.update({
      where: {
        id: id,
      },
      data: medicineData,
    });

    if (!medicine) throw new Error("unable to edit medicine detail");
    return NextResponse.json("medicine updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Couldn't edit medicine in the specified pharmacy" },
      { status: 500 }
    );
  }
}
