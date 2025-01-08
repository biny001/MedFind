/* eslint-disable @typescript-eslint/no-unused-vars */
import getSession from "@/lib/getuserSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { reverseGeocode } from "@/lib/reverseGeocoding";
export const GET = async function (request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized access", { status: 401 });
    }
    const {
      user: { name, email },
    } = session;

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { adminId: session.user.id }, // Match by adminId
          { admins: { has: session.user.id } }, // Match by presence in the admins array
        ],
      },
    });

    if (!pharmacy) {
      throw new Error("Pharmacy not found");
    }
    const [lat, lon] = pharmacy.location.split(",").map((item) => item.trim());

    const medicineStats = await prisma.medicine.groupBy({
      by: ["category"], // Group medicines by category
      where: {
        pharmacyId: pharmacy.id, // Filter by the specific pharmacy
      },
      _count: {
        _all: true, // Count the total medicines in each category
      },
    });

    // Calculate total medicines and unique categories
    const totalMedicines = medicineStats.reduce(
      (sum, group) => sum + group._count._all,
      0
    );
    const uniqueCategories = medicineStats.length;

    // Map to structure category-wise medicine counts
    const categoryCounts = medicineStats.map((group) => ({
      category: group.category,
      count: group._count._all,
    }));
    const location = await reverseGeocode(lat, lon);

    const streetAddress = location.features?.[0]?.text ?? "Unknown";
    const fullAddress = location.features?.[0]?.place_name ?? "Unknown";
    if (!medicineStats) {
      throw new Error("No Medicine Found");
    }

    // Get medicines added in the past 4 months
    const now = new Date();
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(now.getMonth() - 4);

    const monthlyMedicines = await prisma.medicine.findMany({
      where: {
        pharmacyId: pharmacy.id,
        createdAt: {
          gte: fourMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Aggregate the data to group by month
    const monthCounts = monthlyMedicines.reduce(
      (acc: { [key: string]: number }, { createdAt }) => {
        const month = createdAt.toLocaleString("default", { month: "long" });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {}
    );

    // Prepare the chartData in the required format
    const chartData = Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));

    return NextResponse.json(
      {
        categories: categoryCounts,
        totalMedicines,
        location: {
          streetAddress,
          fullAddress,
        },
        name,
        email,
        pharmacyName: pharmacy.name,
        chartData,
      },
      { status: 200 }
    );
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
