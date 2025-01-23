import { auth } from "@/lib/auth";
export const POST = async (request: Request) => {
  const body = await request.json();
  console.log(body);
  const { firstName, lastName, email, password, walletAddress } = body;
  if (!firstName || !lastName || !email || !password || !walletAddress) {
    return new Response("Missing required fields", { status: 400 });
  }
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: `${firstName} ${lastName}`,
      phoneNumber: "1234567890",
    },
  });

  return new Response(JSON.stringify(user), {
    status: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
};
