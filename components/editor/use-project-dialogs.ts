"use client";

import { useState, useCallback } from "react";

type DialogType = "create" | "rename" | "delete" | null;

interface Project {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

interface UseProjectDialogsReturn {
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
  setLoading: (loading: boolean) => void;
  handleCreate: () => Promise<void>;
  handleRename: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const generateSlug = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const openCreateDialog = useCallback(() => {
    setDialogType("create");
    setSelectedProject(null);
    setFormData({ name: "", slug: "" });
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setDialogType("rename");
    setSelectedProject(project);
    setFormData({ name: project.name, slug: project.slug });
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
  }, [generateSlug]);

  const setSlug = useCallback((slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleCreate = useCallback(async () => {
    if (!formData.name.trim() || isLoading) return;
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    closeDialog();
  }, [formData.name, isLoading, closeDialog]);

  const handleRename = useCallback(async () => {
    if (!formData.name.trim() || isLoading || !selectedProject) return;
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    closeDialog();
  }, [formData.name, isLoading, selectedProject, closeDialog]);

  const handleDelete = useCallback(async () => {
    if (isLoading || !selectedProject) return;
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    closeDialog();
  }, [isLoading, selectedProject, closeDialog]);

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
    setLoading,
    handleCreate,
    handleRename,
    handleDelete,
  };
}