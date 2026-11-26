import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { EditorHomeClient } from "@/components/editor/editor-home-client";

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

  // For now, shared projects would be fetched from a different query
  // But we can derive from collaborators for now
  const sharedProjects: typeof projects = [];

  return <EditorHomeClient initialProjects={projects} sharedProjects={sharedProjects} />;
}