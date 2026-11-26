"use client";

import { useState, useCallback, useRef } from "react";
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
  const isLoadingRef = useRef(false);

  const openCreateDialog = useCallback(() => {
    if (isLoadingRef.current) return;
    setDialogType("create");
    setSelectedProject(null);
    setFormData({ name: "", slug: "" });
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    if (isLoadingRef.current) return;
    setDialogType("rename");
    setSelectedProject(project);
    setFormData({ name: project.name, slug: project.id });
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    if (isLoadingRef.current) return;
    setDialogType("delete");
    setSelectedProject(project);
  }, []);

  const closeDialog = useCallback(() => {
    if (isLoadingRef.current) return;
    setDialogType(null);
    setSelectedProject(null);
    setFormData({ name: "", slug: "" });
    setIsLoading(false);
  }, []);

  const finishDialogRequest = useCallback(() => {
    isLoadingRef.current = false;
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
    if (!formData.name.trim() || isLoadingRef.current) return;
    isLoadingRef.current = true;
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
      finishDialogRequest();
      router.push(`/editor/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create project:", error);
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [formData.name, finishDialogRequest, router]);

  const handleRename = useCallback(async () => {
    if (!formData.name.trim() || isLoadingRef.current || !selectedProject) return;
    isLoadingRef.current = true;
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

      finishDialogRequest();
      router.refresh();
    } catch (error) {
      console.error("Failed to rename project:", error);
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [formData.name, selectedProject, finishDialogRequest, router]);

  const handleDelete = useCallback(async () => {
    if (isLoadingRef.current || !selectedProject) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const isActiveWorkspace = pathname.includes(`/editor/${selectedProject.id}`);
      finishDialogRequest();

      if (isActiveWorkspace) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [selectedProject, pathname, finishDialogRequest, router]);

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