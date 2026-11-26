import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { EditorHomeClient } from "@/components/editor/editor-home-client";
import { getProjectsWithAccess } from "@/lib/project-access";

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Loading...</div>;
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      collaborators: true,
    },
  });

  const { shared: sharedProjects } = await getProjectsWithAccess({
    userId,
    includeShared: true,
  });

  return <EditorHomeClient initialProjects={projects} sharedProjects={sharedProjects} />;
}