"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type EditorNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
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
        <div className="text-sm font-medium text-foreground">Editor</div>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="text-sm text-muted-foreground">Workspace</div>
      </div>

      <div className="flex flex-1 justify-end" />
    </header>
  );
}
