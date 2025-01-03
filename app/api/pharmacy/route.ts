/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/auth";
import cloudinary from "@/lib/config";
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

// const typedSession: SessionData = userSession as SessionData;
// const userSession = await getSession();

// if (!userSession) {
//   return new Response("Unauthorized", { status: 401 });
// }

export const POST = async function (request: Request) {
  try {
    const userSession = await getSession();

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
        admins: [typedSession.user.id], // List of additional admin IDs
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
