"use client";

import { useEffect, useState } from "react";
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
    const baseClassName = "flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-base/70 p-3 hover:bg-base/90 transition-colors";
    const activeClassName = "border-primary/50 bg-primary/5 rounded-xl";

    return (
      <div
        key={project.id}
        className={isCurrentRoom ? `${baseClassName} ${activeClassName}` : baseClassName}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
          <p className="text-xs text-muted-foreground truncate">ghost-ai/{slug}</p>
        </div>
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
        <div className="flex min-h-full items-center justify-center text-center">
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
        className={`
          fixed left-4 top-20 z-30 w-[320px] rounded-3xl border border-border/70 bg-surface/95 shadow-2xl shadow-black/20 backdrop-blur-sm
          ${isMobile ? "max-h-[calc(100vh-5rem)]" : ""}
        `}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Projects</p>
            <p className="text-sm text-muted-foreground">Browse and organize your work</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close projects sidebar"
          >
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
              {renderProjectList(projects, true)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="mt-4">
            <ScrollArea className="h-56 rounded-2xl border border-border/60 bg-base/70 p-4">
              {renderProjectList(sharedProjects, false)}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t border-border/60 p-4">
          <Button type="button" onClick={openCreateDialog} className="w-full justify-start gap-2">
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