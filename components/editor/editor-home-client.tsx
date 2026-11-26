"use client";

import { Plus } from "lucide-react";
import { EditorShell } from "@/components/editor/editor-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/lib/project-types";

interface EditorHomeClientProps {
  initialProjects: Project[];
  sharedProjects: Project[];
  roomId?: string;
}

export function EditorHomeClient({ initialProjects, sharedProjects, roomId }: EditorHomeClientProps) {
  const {
    dialogType,
    selectedProject,
    isLoading,
    formData,
    openCreateDialog,
    closeDialog,
    setName,
    setSlug,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  const isCreateDialog = dialogType === "create";
  const isRenameDialog = dialogType === "rename";
  const isDeleteDialog = dialogType === "delete";

  // Find the current project if roomId is provided
  const currentProject = roomId
    ? initialProjects.find((p) => p.id === roomId) || sharedProjects.find((p) => p.id === roomId)
    : null;

  return (
    <EditorShell
      projects={initialProjects}
      sharedProjects={sharedProjects}
      roomId={roomId}
      projectName={currentProject?.name}
    >
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-base px-6 py-10 text-primary">
        <div className="w-full max-w-3xl space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              {currentProject
                ? `Welcome to ${currentProject.name}`
                : "Create a project or open an existing one"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentProject
                ? "Start building your architecture in this workspace."
                : "Start a new architecture workspace, or choose a project from the sidebar."}
            </p>
          </div>

          {currentProject ? (
            <div className="text-sm text-muted-foreground">
              Open the sidebar to switch projects or create a new one.
            </div>
          ) : (
            <Button onClick={openCreateDialog} className="gap-2" size="lg">
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          )}

          <Dialog open={isCreateDialog} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>Enter a name for your new project</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="project-name" className="text-sm font-medium text-foreground">
                    Project Name
                  </label>
                  <Input
                    id="project-name"
                    value={formData.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Project"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="project-slug" className="text-sm font-medium text-foreground">
                    Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">ghost-ai/</span>
                    <Input
                      id="project-slug"
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
                <label htmlFor="rename-name" className="text-sm font-medium text-foreground">
                  New Name
                </label>
                <Input
                  id="rename-name"
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
        </div>
      </section>
    </EditorShell>
  );
}