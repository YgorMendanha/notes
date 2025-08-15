import prisma from "@/lib/pisma";
import { NextResponse } from "next/server";

function auth(req: Request) {
  const auth = req.headers.get("Authentication") ?? "";
  const token = Buffer.from(auth.split(" ")[1] ?? "", "base64").toString(
    "utf8"
  );
  return token === process.env.NEXT_PUBLIC_TOKEN;
}

export async function POST(req: Request) {
  if (!auth(req))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const { title, content, authorId } = (await req.json()) as {
    title?: string;
    content?: string;
    authorId?: number;
  };
  if (!title || !content || !authorId)
    return NextResponse.json({ message: "Invalid Payload" }, { status: 400 });

  try {
    const data = await prisma.post.create({
      data: { title, content, authorId },
    });
    return NextResponse.json({ data, code: "201" }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002")
      return NextResponse.json(
        { code: "P2002", message: error.meta?.target },
        { status: 400 }
      );
    throw error;
  }
}

export async function GET(req: Request) {
  if (!auth(req))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const data = await prisma.post.findMany({
    include: { author: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json({ data, code: "200" });
}

export async function DELETE(req: Request) {
  if (!auth(req))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const id = Number(new URL(req.url).searchParams.get("id"));
  const data = await prisma.post.delete({ where: { id } });
  return NextResponse.json({ data, code: "200" });
}
