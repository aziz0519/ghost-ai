import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkProjectAccess(
  projectId: string,
  userId: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true, collaborators: true },
  });

  if (!project) {
    return { project: null, error: "Project not found", status: 404, isOwner: false };
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator = project.collaborators.some(
    (c) => c.email === userId || c.id === userId
  );

  if (!isOwner && !isCollaborator) {
    return { project: null, error: "Forbidden", status: 403, isOwner: false };
  }

  return { project, error: null, status: 200, isOwner };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; collaboratorId: string }> }
) {
  const { userId } = await auth();
  const { projectId, collaboratorId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Verify user is owner
  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check if collaborator exists and belongs to this project
  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { id: collaboratorId },
    select: { id: true, projectId: true },
  });

  if (!collaborator) {
    return NextResponse.json({ error: "Collaborator not found" }, { status: 404 });
  }

  if (collaborator.projectId !== projectId) {
    return NextResponse.json({ error: "Collaborator not found" }, { status: 404 });
  }

  try {
    await prisma.projectCollaborator.delete({
      where: { id: collaboratorId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete collaborator" }, { status: 500 });
  }
}