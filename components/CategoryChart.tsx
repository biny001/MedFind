"use client";

import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPharmacyDetails } from "@/lib/queryiesandMutations/query";

// Define the type for the data received from the endpoint
interface CategoryData {
  category: string;
  count: number;
}

interface PharmacyData {
  categories: CategoryData[];
  totalMedicines: number;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CategoryChart() {
  const { data, isLoading } = useGetPharmacyDetails();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const pharmacyData = data as PharmacyData;

  const chartData = pharmacyData.categories.map((item, index) => ({
    category: item.category,
    count: item.count,
    fill: colors[index % colors.length],
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    pharmacyData.categories.map((item, index) => [
      item.category,
      {
        label: item.category,
        color: colors[index % colors.length],
      },
    ])
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Medicine Category</CardTitle>
        <CardDescription>Current Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {pharmacyData.totalMedicines.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          medicines
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {pharmacyData.categories.length} categories in total
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current distribution of medicine categories
        </div>
      </CardFooter>
    </Card>
  );
}
