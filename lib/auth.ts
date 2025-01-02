import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession } from "better-auth/plugins";

// import sendMail from "./nodeMailer";

export const prisma = new PrismaClient();

export const auth = betterAuth({
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const pharmacy = await prisma.pharmacy.findFirst({
        where: {
          adminId: user.id,
        },
      });

      return {
        user: {
          ...user,
          approved: pharmacy?.approvalStatus,
        },
        session,
      };
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});

export type Session = typeof auth.$Infer.Session;
// sendResetPassword: async ({ user, url, token }, request) => {
//   await sendMail({
//     to: user.email,
//     subject: "Reset your password",
//     text: `Click the link to reset your password: ${url}`,
//   });
// },
// emailVerification: {
//   sendOnSignUp: true,
//   sendVerificationEmail: async ({ user, url, token }, request) => {
//     await sendMail({
//       to: user.email,
//       subject: "Verify your email address",
//       text: `Click the link to verify your email: ${url}/login`,
//     });
//   },
// },
