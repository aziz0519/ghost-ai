import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditorHomeClient } from "@/components/editor/editor-home-client";
import { AccessDenied } from "@/components/editor/access-denied";
import { checkProjectAccess, getProjectsWithAccess } from "@/lib/project-access";

export default async function EditorWorkspace({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const { userId } = await auth();

  if (!userId) {
    // Redirect to sign-in page for unauthenticated users
    redirect("/sign-in");
  }

  // Fetch the project by ID (roomId)
  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: {
      collaborators: true,
    },
  });

  if (!project) {
    // Project not found - show access denied
    return <AccessDenied />;
  }

  // Check access - owner or collaborator
  const { allowed } = await checkProjectAccess(roomId);

  if (!allowed) {
    return <AccessDenied />;
  }

  // Determine shared projects for this user
  const { shared } = await getProjectsWithAccess({
    userId,
    includeShared: true,
  });

  return (
    <EditorHomeClient
      initialProjects={[project]}
      sharedProjects={shared}
      roomId={roomId}
    />
  );
}