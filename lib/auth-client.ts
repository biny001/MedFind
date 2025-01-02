import {
  customSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),

    inferAdditionalFields({
      user: {
        phoneNumber: {
          type: "string",
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
