import prisma from "@/lib/pisma";
import { featchApi } from "@/server/api";
import { headers } from "next/headers";

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
    title: string;
    content: string;
    authorId: number;
  } = await request.json();

  const { authorId, content, title } = payload;

  if (
    !title ||
    !content ||
    !authorId ||
    title.length === 0 ||
    content.length === 0
  ) {
    return new Response("Invalid Payload", {
      status: 400,
    });
  }

  try {
    const data = await prisma.post.create({ data: payload });
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

export async function GET() {
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

  const data = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  const response = {
    data,
    code: "200",
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}

export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id")) || undefined;

  const data = await prisma.post.delete({ where: { id } });

  const response = {
    data,
    code: "200",
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
