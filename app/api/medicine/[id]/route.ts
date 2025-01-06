/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import getSession from "@/lib/getuserSession";
import { prisma } from "@/lib/auth";
import cloudinary from "@/lib/config";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    // Parse the form data
    const formData = await request.formData();
    const requiredFields = [
      "name",
      "category",
      "price",
      "quantity",
      "medicineImage",
      "form",
    ];

    // Prepare an object to hold the validated data
    const medicineInfos: Record<string, any> = {};

    // Validate required fields
    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value) {
        throw new Error(`Field '${field}' is required.`);
      }
      medicineInfos[field] = value;
    }

    // Additional fields
    medicineInfos.description = formData.get("description") || "";
    medicineInfos.administrationRoute =
      formData.get("administrationRoute") || "";
    medicineInfos.storage = formData.get("storage") || "";
    medicineInfos.supplier = formData.get("supplier") || "";
    medicineInfos.doseUnit = formData.get("doseUnit") || "";
    medicineInfos.doseAmount = formData.get("doseAmount") || "";

    // Convert numeric fields
    medicineInfos.price = parseFloat(medicineInfos.price);
    medicineInfos.quantity = parseInt(medicineInfos.quantity);

    if (isNaN(medicineInfos.price) || medicineInfos.price <= 0) {
      throw new Error("Invalid price value.");
    }

    if (isNaN(medicineInfos.quantity) || medicineInfos.quantity <= 0) {
      throw new Error("Invalid quantity value.");
    }

    // Get the user session
    const userSession = await getSession();
    if (!userSession) return new NextResponse("unauthorized", { status: 401 });

    // Check if the user has access to the pharmacy
    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { adminId: userSession.user.id },
          { admins: { has: userSession.user.id } },
        ],
      },
    });

    if (!pharmacy) throw new Error("unable to get pharmacy");

    // Image upload function to Cloudinary
    const imageUploadPromise = async (image: File) => {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      const imageBase64 = imageData.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: "pharmacy" }
      );

      return result.secure_url;
    };

    // Extract image and other data
    const { id: _, medicineImage, ...updatedData } = medicineInfos;

    // Handle the medicine image
    if (medicineImage instanceof File) {
      // If it's a File, upload it to Cloudinary
      const uploadedImage = await imageUploadPromise(medicineImage);
      updatedData.medicineImage = [uploadedImage];
      console.log(updatedData.medicineImage); // Use the uploaded image URL
    } else if (typeof medicineImage === "string") {
      // If it's already a URL (string), use it directly
      updatedData.medicineImage = [medicineImage];
    } else {
      // Handle the case where the image data is not valid
      updatedData.medicineImage = ""; // Or any default behavior you prefer
    }

    // console.log(updatedData);

    // Update medicine in Prisma
    const medicine = await prisma.medicine.update({
      where: {
        id: id,
      },
      data: updatedData, // Use all the validated data
    });

    if (!medicine) throw new Error("unable to edit medicine detail");

    return NextResponse.json("medicine updated successfully", { status: 201 });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const userSession = await getSession();

    if (!userSession) return new NextResponse("unauthorized", { status: 401 });

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { adminId: userSession.user.id }, // Match by adminId
          { admins: { has: userSession.user.id } }, // Match by presence in the admins array
        ],
      },
    });

    if (!pharmacy) throw new Error("unable to get pharmacy");

    const medicine = await prisma.medicine.delete({
      where: {
        id: id,
      },
    });

    if (!medicine) throw new Error("unable to delete medicine detail");

    return NextResponse.json("medicine deleted successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Couldn't delete medicine in the specified pharmacy" },
      { status: 500 }
    );
  }
}
