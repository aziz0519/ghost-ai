"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="fixed left-4 top-20 z-30 w-[320px] rounded-3xl border border-border/70 bg-surface/95 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">Projects</p>
          <p className="text-sm text-muted-foreground">Browse and organize your work</p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close projects sidebar">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="px-4 py-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="mt-4">
          <ScrollArea className="h-56 rounded-2xl border border-border/60 bg-base/70 p-4">
            <div className="flex min-h-full items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">No projects yet. Start a new one to get going.</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="shared" className="mt-4">
          <ScrollArea className="h-56 rounded-2xl border border-border/60 bg-base/70 p-4">
            <div className="flex min-h-full items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">Shared projects will appear here.</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="border-t border-border/60 p-4">
        <Button type="button" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
