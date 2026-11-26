import { auth, clerkClient } from "@clerk/nextjs/server";
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

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail || primaryEmail.verification?.status !== "verified") {
      return null;
    }

    return primaryEmail.emailAddress.trim().toLowerCase();
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function checkProjectAccess(
  projectId: string
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
  const primaryEmail = await getPrimaryEmail();
  const isCollaborator =
    primaryEmail !== null &&
    project.collaborators.some(
      (collaborator) => normalizeEmail(collaborator.email) === primaryEmail
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
    const primaryEmail = await getPrimaryEmail();
    if (primaryEmail) {
      shared = await prisma.project.findMany({
        where: {
          collaborators: {
            some: {
              email: {
                equals: primaryEmail,
                mode: "insensitive",
              },
            },
          },
        },
        include: { collaborators: true },
        orderBy: { createdAt: "desc" },
      });

      shared = shared.filter((project) =>
        project.collaborators.some(
          (collaborator) => normalizeEmail(collaborator.email) === primaryEmail
        )
      );
    }
  }

  return { owned, shared };
}