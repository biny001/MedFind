import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    phoneNumber: z
      .preprocess((val) => {
        if (typeof val === "string") {
          const cleaned = val.replace(/\D/g, ""); // Remove all non-numeric characters
          return cleaned;
        }
        return val;
      }, z.string().min(9, { message: "Phone number must be at least 9 digits." }))
      .refine((val) => /^\d+$/.test(val as string), {
        message: "Phone number must contain only digits.",
      }),
    countryCode: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export type LoginValues = z.infer<typeof loginSchema>;
