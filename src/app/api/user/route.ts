import prisma from "@/lib/pisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = headers();
  const athentication = headersList.get("Authentication");

  if (
    !athentication ||
    Buffer.from(athentication?.split(" ")[1]!, "base64").toString("utf8") !==
      process.env.NEXT_PUBLIC_TOKEN
  ) {
    return new Response("unauthorized", {
      status: 401,
    });
  }

  const payload: {
    user: string;
  } = await request.json();

  const { user } = payload;

  if (!user || user.length === 0) {
    return new Response("Invalid Payload", {
      status: 400,
    });
  }

  try {
    const data = await prisma.user.create({ data: payload });

    const response = {
      data,
      code: "201",
    };
    return new Response(JSON.stringify(response), {
      status: 201,
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      const response = { code: "P2002", message: error.meta.target };
      return new Response(JSON.stringify(response), {
        status: 400,
      });
    }
  }
}
