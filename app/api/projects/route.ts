import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      collaborators: true,
    },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const parsedBody = createProjectSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
  }

  const { name, description } = parsedBody.data;

  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name: name?.trim() || "Untitled Project",
      description: description?.trim() || null,
    },
    include: {
      collaborators: true,
    },
  });

  return NextResponse.json(project, { status: 201 });
}