/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/auth";
import cloudinary from "@/lib/config";
import getSession from "@/lib/getuserSession";
import { NextResponse } from "next/server";

export const GET = async function () {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized access", { status: 401 });
    }

    const pharmacyId = session.user.pharmacyId;
    if (!pharmacyId) {
      throw new Error("Add a pharmacy first");
    }

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
    });

    if (!pharmacy) {
      throw new Error("Pharmacy not found");
    }

    const medicine = await prisma.medicine.findMany({
      where: {
        pharmacyId: pharmacy.id,
      },
    });

    if (!medicine) {
      throw new Error("No Medicine Found");
    }

    return NextResponse.json(medicine, { status: 200 });
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

export const POST = async function (request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized access", { status: 401 });
    }

    const pharmacyId = session.user.pharmacyId;
    if (!pharmacyId) {
      throw new Error("Add a pharmacy first");
    }

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
    });

    if (!pharmacy || pharmacy.approvalStatus !== "APPROVED") {
      throw new Error(
        "Unapproved pharmacy: Medicines can only be added after approval."
      );
    }

    const formData = await request.formData();
    console.log(formData);
    const requiredFields = [
      "name",
      "category",
      "price",
      "quantity",
      "medicineImage",
      "form",
    ];

    const medicineInfos: Record<string, any> = {};
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

    // Upload the image
    const imageUploadPromise = async (image: any) => {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      const imageBase64 = imageData.toString("base64");

      //   // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: "myschool" }
      );

      return result.secure_url;
    };

    // Wait for all the images to upload
    const uploadedImage = await imageUploadPromise(
      formData.get("medicineImage")
    );

    medicineInfos.medicineImage = uploadedImage;

    // Create the medicine record
    console.log(medicineInfos);
    const newMedicine = await prisma.medicine.create({
      data: {
        name: medicineInfos.name,
        category: medicineInfos.category,
        price: medicineInfos.price,
        quantity: medicineInfos.quantity,
        medicineImage: [medicineInfos.medicineImage],
        description: medicineInfos.description,
        administrationRoute: medicineInfos.administrationRoute,
        storage: medicineInfos.storage,
        supplier: medicineInfos.supplier,
        doseUnit: medicineInfos.doseUnit,
        doseAmount: medicineInfos.doseAmount,
        pharmacyId,
        form: medicineInfos.form, // Add a default or appropriate value for the 'form' property
      },
    });

    return new Response(
      JSON.stringify({ message: "medicine added successfully", newMedicine }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "can not add the medicine in your pharmacy" },
      { status: 500 }
    );
  }
};
