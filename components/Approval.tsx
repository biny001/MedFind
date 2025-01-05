import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
const Approval = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Pharmacy Approval Required
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Clock className="w-24 h-24 text-primary mb-4" />
          <p className="text-center text-lg">
            To access this page, your pharmacy must be verified. Please check
            your email for the pharmacy approval status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Approval;
