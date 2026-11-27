"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Sparkles, Share2 } from "lucide-react";

type EditorNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleRightSidebar?: () => void;
  isRightSidebarOpen?: boolean;
  projectName?: string;
  projectId?: string;
  isOwner?: boolean;
  onShare?: (props: { projectId: string; isOwner: boolean }) => void;
};

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  onToggleRightSidebar,
  isRightSidebarOpen,
  projectName,
  projectId,
  isOwner,
  onShare,
}: EditorNavbarProps) {
  return (
    <header className="z-40 flex h-12 shrink-0 items-center border-b border-border/70 bg-surface/95 px-3 backdrop-blur-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-foreground">{projectName ?? "Workspace"}</p>
          <p className="text-[11px] text-muted-foreground">Workspace</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        {projectId && onShare && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onShare({ projectId, isOwner: isOwner ?? false })}
            className="gap-2 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Share project"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        )}
        {onToggleRightSidebar && (
          <Button
            type="button"
            size="sm"
            onClick={onToggleRightSidebar}
            className={`gap-2 rounded-lg px-3 ${
              isRightSidebarOpen ? "bg-brand text-primary-foreground hover:bg-brand/80" : "bg-elevated text-muted-foreground"
            }`}
            aria-label={isRightSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
