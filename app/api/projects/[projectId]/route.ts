import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkProjectOwnership(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true, name: true, description: true },
  });

  if (!project) {
    return { project: null, error: "Project not found", status: 404 };
  }

  if (project.ownerId !== userId) {
    return { project: null, error: "Forbidden", status: 403 };
  }

  return { project, error: null, status: 200 };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json();
  const { name, description } = body;

  const ownership = await checkProjectOwnership(projectId, userId);

  if (ownership.error) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: name?.trim() || ownership.project!.name,
      description: description?.trim() ?? ownership.project!.description,
    },
    include: {
      collaborators: true,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const ownership = await checkProjectOwnership(projectId, userId);

  if (ownership.error) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ success: true });
}