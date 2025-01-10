import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
export const prisma = new PrismaClient();

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 30 * 60, // Cache duration in seconds
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const pharmacy = await prisma.pharmacy.findFirst({
        where: {
          OR: [
            { adminId: user.id }, // Match by adminId
            { admins: { has: user.id } }, // Match by presence in the admins array
          ],
        },
      });

      const userdata = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      return {
        user: {
          ...user,
          approved: pharmacy?.approvalStatus,
          pharmacyId: pharmacy?.id,
          role: userdata?.role,
        },
        session,
      };
    }),
    nextCookies(),
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
