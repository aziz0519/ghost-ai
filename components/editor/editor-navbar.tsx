"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Bot, Share2 } from "lucide-react";

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
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-border/70 bg-surface/95 px-4 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        <div className="text-sm font-medium text-foreground">
          {projectName ? `Editor / ${projectName}` : "Editor"}
        </div>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="text-sm text-muted-foreground">Workspace</div>
      </div>

      <div className="flex flex-1 justify-end items-center gap-2">
        {onToggleRightSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleRightSidebar}
            className={`rounded-full text-muted-foreground hover:bg-muted hover:text-foreground ${
              isRightSidebarOpen ? "text-primary" : ""
            }`}
            aria-label={isRightSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          >
            <Bot className="h-4 w-4" />
          </Button>
        )}
        <UserButton />
        {projectId && onShare && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onShare({ projectId, isOwner: isOwner ?? false })}
            className={`rounded-full text-muted-foreground hover:bg-muted hover:text-foreground ${
              projectName ? "text-primary" : "text-muted-foreground"
            }`}
            aria-label="Share project"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </div>
    </header>
  );
}
