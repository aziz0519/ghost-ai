"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Trash2 } from "lucide-react";

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  isOwner: boolean;
}

export function ShareDialog({ open, onOpenChange, projectId, isOwner }: ShareDialogProps) {
  // Initial loading state is true; the component is remounted via `key` whenever it
  // opens so state resets naturally without a reset effect.
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !projectId) return;

    let cancelled = false;

    fetch(`/api/projects/${projectId}/collaborators`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Failed to load collaborators");
        return data as Collaborator[];
      })
      .then((data) => {
        if (!cancelled) setCollaborators(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCollaborators(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, projectId]);

  const handleInvite = useCallback(async () => {
    if (!projectId || !inviteEmail.trim() || isInviting) return;
    setIsInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Failed to invite collaborator");

      setCollaborators((prev) => [...prev, data as Collaborator]);
      setInviteEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite collaborator");
    } finally {
      setIsInviting(false);
    }
  }, [projectId, inviteEmail, isInviting]);

  const handleRemove = useCallback(
    async (collaboratorId: string) => {
      if (!projectId || removingId) return;
      setRemovingId(collaboratorId);
      setError(null);

      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error ?? "Failed to remove collaborator");
        }

        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove collaborator");
      } finally {
        setRemovingId(null);
      }
    },
    [projectId, removingId]
  );

  const handleCopyLink = useCallback(async () => {
    if (!projectId) return;
    const url = `${window.location.origin}/editor/${projectId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [projectId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators by email. They will be able to open this workspace."
              : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isOwner && (
            <div className="space-y-2">
              <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                Invite by email
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleInvite();
                    }
                  }}
                  placeholder="collaborator@example.com"
                  disabled={isInviting}
                />
                <Button
                  type="button"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Collaborators</p>
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {isLoadingCollaborators ? (
                <p className="text-sm text-muted-foreground">Loading collaborators...</p>
              ) : collaborators.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {isOwner ? "No collaborators yet." : "No other collaborators."}
                </p>
              ) : (
                collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.avatarUrl}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium text-muted-foreground">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">{c.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                    {isOwner && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(c.id)}
                        disabled={removingId === c.id}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${c.email}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyLink}
              className="w-full gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy project link"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
