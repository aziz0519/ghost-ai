"use client";

import { useEffect, useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import type { Project } from "@/lib/project-types";

interface EditorShellProps {
  children: React.ReactNode;
  projects?: Project[];
  sharedProjects?: Project[];
  roomId?: string;
  projectName?: string;
  projectId?: string;
  isOwner?: boolean;
  onShare?: (props: { projectId: string; isOwner: boolean }) => void;
}

export function EditorShell({
  children,
  projects = [],
  sharedProjects = [],
  roomId,
  projectName,
  projectId,
  isOwner,
  onShare,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    const desktopSidebar = window.matchMedia("(min-width: 768px)");
    const desktopCopilot = window.matchMedia("(min-width: 1024px)");
    const syncPanelsToViewport = () => {
      setIsSidebarOpen(desktopSidebar.matches);
      setIsRightSidebarOpen(desktopCopilot.matches);
    };

    syncPanelsToViewport();
    desktopSidebar.addEventListener("change", syncPanelsToViewport);
    desktopCopilot.addEventListener("change", syncPanelsToViewport);

    return () => {
      desktopSidebar.removeEventListener("change", syncPanelsToViewport);
      desktopCopilot.removeEventListener("change", syncPanelsToViewport);
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => {
          setIsRightSidebarOpen(false);
          setIsSidebarOpen((value) => !value);
        }}
        onToggleRightSidebar={() => {
          setIsSidebarOpen(false);
          setIsRightSidebarOpen((value) => !value);
        }}
        isRightSidebarOpen={isRightSidebarOpen}
        projectName={projectName}
        projectId={projectId}
        isOwner={isOwner}
        onShare={onShare}
      />
      <div className="flex min-h-0 flex-1 gap-2 p-2">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={projects}
          sharedProjects={sharedProjects}
          roomId={roomId}
        />
        <main className="flex min-h-0 min-w-0 flex-1">{children}</main>
        {isRightSidebarOpen && (
          <aside className="fixed inset-x-2 bottom-2 top-14 z-30 flex flex-col overflow-hidden rounded-[24px] border border-border/80 bg-surface shadow-2xl shadow-black/30 lg:relative lg:inset-auto lg:z-0 lg:w-80 lg:shrink-0 lg:shadow-none">
            <div className="flex items-start justify-between border-b border-border/70 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">AI Copilot</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Placeholder panel</p>
              </div>
              <span className="mt-1 text-ai-text" aria-hidden="true">✧</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between p-4">
              <div className="flex items-center gap-3 rounded-[20px] border border-border/80 bg-elevated/60 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ai/15 text-ai-text">
                  <span aria-hidden="true">✧</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Chat surface pending</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    The toggle is wired. Messaging and generation are intentionally out of scope here.
                  </p>
                </div>
              </div>
              <div className="rounded-[20px] border border-dashed border-border/80 bg-base/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">Future hooks</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Prompt composer, run status, and architecture guidance will attach to this sidebar.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}