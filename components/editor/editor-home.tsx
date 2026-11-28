"use client";

import { EditorShell } from "@/components/editor/editor-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

export function EditorHomeContent() {
  const {
    dialogType,
    selectedProject,
    isLoading,
    formData,
    closeDialog,
    setName,
    handleRename,
    handleDelete,
  } = useProjectDialogs();

  const isRenameDialog = dialogType === "rename";
  const isDeleteDialog = dialogType === "delete";

  return (
    <EditorShell>
      <>
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-[24px] border border-dashed border-border/80 bg-surface px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Select a project from the sidebar to open its canvas.
          </p>
        </div>
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
      </>
    </EditorShell>
  );
}