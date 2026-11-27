"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/lib/project-types";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  sharedProjects: Project[];
  roomId?: string;
};

export function ProjectSidebar({ isOpen, onClose, projects, sharedProjects, roomId }: ProjectSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const {
    dialogType,
    selectedProject,
    isLoading,
    formData,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    setName,
    setSlug,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isCreateDialog = dialogType === "create";
  const isRenameDialog = dialogType === "rename";
  const isDeleteDialog = dialogType === "delete";

  if (!isOpen) {
    return null;
  }

  const renderProjectItem = (project: Project, isOwned: boolean) => {
    const isCurrentRoom = roomId && project.id === roomId;
    const slug = project.slug || project.id;
    const baseClassName = "flex items-center justify-between gap-2 rounded-2xl border border-transparent bg-transparent px-3 py-2.5 transition-colors hover:bg-elevated/70";
    const activeClassName = "border-border/70 bg-brand/10";

    return (
      <div
        key={project.id}
        className={isCurrentRoom ? `${baseClassName} ${activeClassName}` : baseClassName}
      >
        <Link
          href={`/editor/${project.id}`}
          onClick={onClose}
          className="flex-1 min-w-0"
        >
          <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
          <span className="sr-only">ghost-ai/{slug}</span>
        </Link>
        {isOwned && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => openRenameDialog(project)}
              disabled={isLoading}
              aria-label="Rename project"
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => openDeleteDialog(project)}
              disabled={isLoading}
              aria-label="Delete project"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderProjectList = (projects: Project[], isOwned: boolean) => {
    if (projects.length === 0) {
      return (
        <div className="flex min-h-32 items-center justify-center px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isOwned ? "No projects yet. Start a new one to get going." : "Shared projects will appear here."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {projects.map((project) => renderProjectItem(project, isOwned))}
      </div>
    );
  };

  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={isMobile
          ? "fixed inset-y-14 left-2 z-30 flex max-h-[calc(100dvh-4rem)] w-[min(20rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[24px] border border-border/80 bg-surface shadow-2xl shadow-black/30"
          : "relative z-10 hidden h-full w-72 shrink-0 flex-col overflow-hidden rounded-[24px] border border-border/80 bg-surface md:flex"}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3.5">
          <p className="text-sm font-semibold text-foreground">Projects</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close projects sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col px-3 py-3">
          <TabsList className="grid h-9 w-full grid-cols-2 rounded-xl bg-elevated p-1">
            <TabsTrigger value="my-projects" className="rounded-lg text-xs">My Projects</TabsTrigger>
            <TabsTrigger value="shared" className="rounded-lg text-xs">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="mt-3 min-h-0 flex-1">
            <ScrollArea className="h-full">
              {renderProjectList(projects, true)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="mt-3 min-h-0 flex-1">
            <ScrollArea className="h-full">
              {renderProjectList(sharedProjects, false)}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t border-border/70 p-2">
          <Button type="button" onClick={openCreateDialog} className="h-9 w-full justify-center gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <Dialog open={isCreateDialog} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Enter a name for your new project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="sidebar-project-name" className="text-sm font-medium text-foreground">
                  Project Name
                </label>
                <Input
                  id="sidebar-project-name"
                  value={formData.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Project"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sidebar-project-slug" className="text-sm font-medium text-foreground">
                  Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">ghost-ai/</span>
                  <Input
                    id="sidebar-project-slug"
                    value={formData.slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-project"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be used in the project URL. Generated automatically from the name.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name.trim() || isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRenameDialog} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Currently named &ldquo;{selectedProject?.name}&rdquo;
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label htmlFor="sidebar-rename-name" className="text-sm font-medium text-foreground">
                New Name
              </label>
              <Input
                id="sidebar-rename-name"
                value={formData.name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New project name"
                autoFocus
                disabled={isLoading}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleRename} disabled={!formData.name.trim() || isLoading}>
                {isLoading ? "Saving..." : "Rename"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialog} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{selectedProject?.name}&rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </>
  );
}