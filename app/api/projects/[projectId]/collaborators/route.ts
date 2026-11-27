import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
});

async function checkProjectAccess(
  projectId: string,
  userId: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true, collaborators: true },
  });

  if (!project) {
    return { project: null, error: "Project not found", status: 404 };
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator = project.collaborators.some(
    (c) => c.email === userId || c.id === userId
  );

  if (!isOwner && !isCollaborator) {
    return { project: null, error: "Forbidden", status: 403 };
  }

  return { project, error: null, status: 200, isOwner };
}

async function enrichCollaborators(collaborators: Array<{ email: string; id?: string }>) {
  const client = await clerkClient();
  const enriched = await Promise.all(
    collaborators.map(async (c) => {
      try {
        const userList = await client.users.getUserList({
          emailAddress: [c.email],
          limit: 1,
        });
        const user = userList.data[0];
        return {
          id: c.id,
          email: c.email,
          name: user?.fullName || c.email,
          avatarUrl: user?.imageUrl || null,
        };
      } catch {
        return {
          id: c.id,
          email: c.email,
          name: c.email,
          avatarUrl: null,
        };
      }
    })
  );
  return enriched;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const access = await checkProjectAccess(projectId, userId);

  if (access.error) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  });

  const enriched = await enrichCollaborators(collaborators);

  return NextResponse.json(enriched);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const parsedBody = inviteSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { email } = parsedBody.data;

  const access = await checkProjectAccess(projectId, userId);

  if (access.error) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (!access.isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Collaborator already invited" }, { status: 409 });
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: {
      projectId,
      email,
    },
    select: { id: true, email: true, createdAt: true },
  });

  const enriched = await enrichCollaborators([collaborator]);

  return NextResponse.json(enriched[0], { status: 201 });
}
