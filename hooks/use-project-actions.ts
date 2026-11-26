"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Project } from "@/lib/project-types";

type DialogType = "create" | "rename" | "delete" | null;

interface UseProjectActionsReturn {
  dialogType: DialogType;
  selectedProject: Project | null;
  isLoading: boolean;
  formData: { name: string; slug: string };
  openCreateDialog: () => void;
  openRenameDialog: (project: Project) => void;
  openDeleteDialog: (project: Project) => void;
  closeDialog: () => void;
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  handleCreate: () => Promise<void>;
  handleRename: () => Promise<void>;
  handleDelete: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useProjectActions(): UseProjectActionsReturn {
  const router = useRouter();
  const pathname = usePathname();

  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const openCreateDialog = useCallback(() => {
    setDialogType("create");
    setSelectedProject(null);
    setFormData({ name: "", slug: "" });
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setDialogType("rename");
    setSelectedProject(project);
    setFormData({ name: project.name, slug: project.id });
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    setDialogType("delete");
    setSelectedProject(project);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedProject(null);
    setFormData({ name: "", slug: "" });
    setIsLoading(false);
  }, []);

  const setName = useCallback((name: string) => {
    setFormData((prev) => ({
      name,
      slug: prev.slug || generateSlug(name),
    }));
  }, []);

  const setSlug = useCallback((slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!formData.name.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim(), description: "" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const project = await response.json();
      closeDialog();
      router.push(`/editor/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create project:", error);
      setIsLoading(false);
    }
  }, [formData.name, isLoading, closeDialog, router]);

  const handleRename = useCallback(async () => {
    if (!formData.name.trim() || isLoading || !selectedProject) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename project");
      }

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Failed to rename project:", error);
      setIsLoading(false);
    }
  }, [formData.name, isLoading, selectedProject, closeDialog, router]);

  const handleDelete = useCallback(async () => {
    if (isLoading || !selectedProject) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const isActiveWorkspace = pathname.includes(`/editor/${selectedProject.id}`);
      closeDialog();

      if (isActiveWorkspace) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsLoading(false);
    }
  }, [isLoading, selectedProject, pathname, closeDialog, router]);

  const refreshProjects = useCallback(async () => {
    router.refresh();
  }, [router]);

  return {
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
    refreshProjects,
  };
}