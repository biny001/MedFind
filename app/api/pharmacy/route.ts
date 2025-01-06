/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/auth";
import cloudinary from "@/lib/config";
import getSession from "@/lib/getuserSession";
import { NextResponse } from "next/server";

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

// const typedSession: SessionData = userSession as SessionData;
// const userSession = await getSession();

// if (!userSession) {
//   return new Response("Unauthorized", { status: 401 });
// }

export const GET = async function (request: Request) {
  try {
    const userSession = await getSession();

    if (!userSession) return new Response("unauthorized", { status: 401 });

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { adminId: userSession.user.id }, // Match by adminId
          { admins: { has: userSession.user.id } }, // Match by presence in the admins array
        ],
      },
    });

    console.log(pharmacy);
    if (!pharmacy) {
      return new Response("Pharmacy not found", { status: 404 });
    }

    return NextResponse.json(pharmacy, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response((error as Error).message, { status: 500 });
  }
};

export const POST = async function (request: Request) {
  try {
    const userSession = await getSession();

    console.log(userSession);
    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    const typedSession: SessionData = userSession as SessionData;

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phoneNumber") as string;
    const location = formData.get("location") as string;
    const images = formData.getAll("images") as File[];
    const pharmacyLicense = formData.getAll("pharmacyLicense") as File[];
    const ownerLicense = formData.getAll("pharmacyLicense") as File[];

    if (!pharmacyLicense) {
      throw new Error("Invalid or missing pharmacy license file.");
    }

    if (!ownerLicense) {
      throw new Error("Invalid or missing owner license file.");
    }

    let uploadedImage = [""];
    let pharmacyLicenseImage = [""];
    let ownerLicenseImage = [""];

    console.log({
      name,
      email,
      phone,
      location,
      pharmacyLicense,
      ownerLicense,
    });

    if (images.length > 0) {
      const imageUploadPromises = images.map(async (image) => {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        // upload to cloudinary

        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          { folder: "pharmacy" }
        );

        return result.secure_url;
      });
      uploadedImage = await Promise.all(imageUploadPromises);
    }
    if (pharmacyLicense.length > 0) {
      const imageUploadPromises = images.map(async (image) => {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        // upload to cloudinary

        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          { folder: "pharmacy" }
        );

        return result.secure_url;
      });
      pharmacyLicenseImage = await Promise.all(imageUploadPromises);
    }
    if (ownerLicense.length > 0) {
      const imageUploadPromises = images.map(async (image) => {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        // upload to cloudinary

        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          { folder: "pharmacy" }
        );

        return result.secure_url;
      });
      ownerLicenseImage = await Promise.all(imageUploadPromises);
    }

    const pharmacy = await prisma.pharmacy.create({
      data: {
        name: name,
        location: location,
        phoneNumber: phone,
        email: email,
        adminId: typedSession.user.id,
        approvalStatus: "PENDING",
        admins: undefined, // List of additional admin IDs
        pharmacyImage: uploadedImage,
        pharmacyLicence: pharmacyLicenseImage,
        ownerLicence: ownerLicenseImage[0],
      },
    });

    console.log(pharmacy);

    return new Response("Pharmacy created successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};

export const PUT = async function (request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("No user session found", { status: 401 });
    }

    if (!session.user.pharmacyId) {
      throw new Error("You have no pharmacy to edit");
    }

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: session.user.pharmacyId },
    });

    if (!pharmacy) {
      throw new Error("Specified pharmacy does not exist");
    }

    if (session.user.id !== pharmacy.adminId) {
      return new Response("Unauthorized access to an unowned pharmacy", {
        status: 401,
      });
    }

    if (!session.user.approved) {
      throw new Error(
        "You cannot edit any information until your pharmacy is approved"
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const location = formData.get("location") as string | null;

    // Update the pharmacy with incoming fields
    const updatedPharmacy = await prisma.pharmacy.update({
      where: { id: session.user.pharmacyId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(location && { location }),
      },
    });

    return new Response(
      JSON.stringify({
        message: "Pharmacy updated successfully",
        updatedPharmacy,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
};
