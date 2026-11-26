import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ProjectRole = "owner" | "collaborator";

export interface ProjectAccess {
  userId: string;
  primaryEmail: string | null;
  role: ProjectRole;
  projectId: string | null;
}

export async function getCurrentClerkIdentity(): Promise<{
  userId: string;
  primaryEmail: string | null;
}> {
  const { userId } = await auth();
  const primaryEmail = await getPrimaryEmail();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return { userId, primaryEmail };
}

export async function getPrimaryEmail(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Get user profile from Clerk to find primary email
  // This is a placeholder - in a real implementation, you'd query Clerk's API
  // For now, return null and let callers handle the case
  return null;
}

export async function checkProjectAccess(
  projectId: string,
  options: { userId: string; role?: ProjectRole } = { userId: "" }
): Promise<{
  allowed: boolean;
  role?: ProjectRole;
  projectExists: boolean;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { allowed: false, role: undefined, projectExists: false };
  }

  // Check if project exists and user has access
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  });

  if (!project) {
    return { allowed: false, role: undefined, projectExists: false };
  }

  // Check if user is the owner
  if (project.ownerId === userId) {
    return { allowed: true, role: "owner", projectExists: true };
  }

  // Check if user is a collaborator
  const isCollaborator = project.collaborators.some(
    (c) => c.email === userId || c.id === userId
  );

  if (isCollaborator) {
    return { allowed: true, role: "collaborator", projectExists: true };
  }

  return { allowed: false, role: undefined, projectExists: true };
}

export async function getProjectsWithAccess(
  options: { userId: string; includeShared?: boolean } = { userId: "" }
) {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const owned = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { collaborators: true },
    orderBy: { createdAt: "desc" },
  });

  let shared: typeof owned = [];
  if (options.includeShared) {
    shared = await prisma.project.findMany({
      where: {
        collaborators: {
          some: {
            email: userId,
          },
        },
      },
      include: { collaborators: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return { owned, shared };
}