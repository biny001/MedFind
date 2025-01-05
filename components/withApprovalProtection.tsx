/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { NextPage } from "next";
import getSession from "@/lib/getuserSession";
import Approval from "./Approval";

// Define a type for the props that can be passed to the wrapped component
type WithApprovalProtectionProps = {
  [key: string]: any;
};

// Define the type for the HOC
export function withApprovalProtection<P extends WithApprovalProtectionProps>(
  Component: NextPage<P>
): NextPage<P> {
  const ProtectedComponent: NextPage<P> = async (props) => {
    const userSession = await getSession();

    if (userSession?.user.approved !== "APPROVED") {
      return <Approval />;
    }

    return <Component {...props} />;
  };

  // Copy static properties from the original component
  ProtectedComponent.getInitialProps = Component.getInitialProps;

  return ProtectedComponent;
}
