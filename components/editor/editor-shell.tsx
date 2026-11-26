"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import type { Project } from "@/lib/project-types";

interface EditorShellProps {
  children: React.ReactNode;
  projects?: Project[];
  sharedProjects?: Project[];
  roomId?: string;
  projectName?: string;
}

export function EditorShell({ children, projects = [], sharedProjects = [], roomId, projectName }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
        onToggleRightSidebar={() => setIsRightSidebarOpen((value) => !value)}
        isRightSidebarOpen={isRightSidebarOpen}
        projectName={projectName}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        sharedProjects={sharedProjects}
        roomId={roomId}
      />
      <div className="flex-1 flex">
        <main className="flex-1 pt-16 min-w-0">{children}</main>
        {isRightSidebarOpen && (
          <aside className="w-80 border-l border-border/60 bg-base/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">AI Assistant</h3>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              AI chat will appear here in a future update.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}