import prisma from "@/lib/pisma";
import { NextResponse } from "next/server";

function checkAuth(request: Request) {
  const auth = request.headers.get("Authentication") ?? "";
  const token = Buffer.from(auth.split(" ")[1] ?? "", "base64").toString(
    "utf8"
  );
  return token === process.env.NEXT_PUBLIC_TOKEN;
}

export async function POST(request: Request) {
  if (!checkAuth(request))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const { user } = (await request.json()) as { user?: string };
  if (!user)
    return NextResponse.json({ message: "Invalid Payload" }, { status: 400 });

  try {
    const data = await prisma.user.create({ data: { user } });
    return NextResponse.json({ data, code: "201" }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002")
      return NextResponse.json(
        { code: "P2002", message: error.meta?.target },
        { status: 400 }
      );
    return NextResponse.json(
      { code: "ERROR", message: error?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
