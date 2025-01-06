/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/auth";

import getSession from "@/lib/getuserSession";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sendMail from "@/lib/nodeMailer";
import { phoneNumber } from "better-auth/plugins";

export const GET = async function () {
  try {
    const userSession = await getSession();
    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (userSession.user.approved !== "APPROVED") {
      return new Response("Unauthorized", { status: 401 });
    }

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        id: userSession.user.pharmacyId,
      },
    });

    if (!pharmacy) {
      throw new Error("Pharmacy not found for this user.");
    }

    // Step 2: Get all users associated with the pharmacy
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { id: userSession.user.id }, // Pharmacy admin
          { id: { in: pharmacy.admins } }, // Additional admins
        ],
      },
    });

    if (!users) {
      return new Response("No users found", { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't get a medicine in the specified pharmacy" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const userSession = await getSession();

    if (!userSession || userSession.user.approved !== "APPROVED") {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    console.log(formData);

    const pharmacy = await prisma.pharmacy.findFirst({
      where: { adminId: userSession.user.id },
    });

    if (!pharmacy) throw new Error("Only owners can add new Admins.");
    // console.log(pharmacy);
    if (email === userSession.user.email)
      throw new Error("Admin cannot register himself/herself");

    const newUser = await auth.api.signUpEmail({
      body: { name, email, password, phoneNumber: phoneNumber },
    });
    if (!newUser) throw new Error("Unable to register new User");
    console.log(newUser);

    // Check if new admin already exists in the pharmacy
    if (pharmacy.admins.includes(newUser.user.id)) {
      throw new Error("This admin already exists in the pharmacy.");
    }

    // Update pharmacy with the new admin
    const updatedPharmacy = await prisma.pharmacy.update({
      where: { id: pharmacy.id },
      data: { admins: { set: [...pharmacy.admins, newUser.user.id] } },
    });

    if (!updatedPharmacy) throw new Error("Unable to add new Admins");

    // Send an email notification
    await sendMail({
      to: newUser.user.email,
      subject: "Pharmacy Approval",
      text: `<p>Your password is: ${password}</p>`,
    });

    return new Response("Admin added successfully", { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
