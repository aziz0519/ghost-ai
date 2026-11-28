"use client";

import { EditorShell } from "@/components/editor/editor-shell";
import { ShareDialog } from "@/components/editor/share-dialog";
import { WorkspaceCanvas } from "@/components/editor/workspace-canvas";
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
    openShareDialog,
    closeDialog,
    setName,
    handleRename,
    handleDelete,
  } = useProjectActions();

  const isRenameDialog = dialogType === "rename";
  const isDeleteDialog = dialogType === "delete";
  const isShareDialog = dialogType === "share";

  // Use the newest available project when the workspace route has no room ID.
  const currentProject = roomId
    ? initialProjects.find((p) => p.id === roomId) || sharedProjects.find((p) => p.id === roomId)
    : initialProjects[0] || sharedProjects[0] || null;

  // Determine if the user is the owner of the current project
  const isOwner = currentProject
    ? initialProjects.some((p) => p.id === currentProject.id)
    : false;

  const handleShare = () => {
    if (currentProject) {
      openShareDialog(currentProject);
    }
  };

  return (
    <EditorShell
      projects={initialProjects}
      sharedProjects={sharedProjects}
      roomId={currentProject?.id}
      projectName={currentProject?.name}
      projectId={currentProject?.id}
      isOwner={isOwner}
      onShare={handleShare}
    >
      <>
        {currentProject ? (
          <WorkspaceCanvas roomId={currentProject.id} />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-[24px] border border-dashed border-border/80 bg-surface px-6 text-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">No project selected</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a project or select one from the sidebar to open its canvas.
              </p>
            </div>
          </div>
        )}
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

          <ShareDialog
            open={isShareDialog}
            onOpenChange={(open) => { if (!open) closeDialog(); }}
            projectId={currentProject?.id ?? null}
            isOwner={isOwner}
          />
      </>
    </EditorShell>
  );
}