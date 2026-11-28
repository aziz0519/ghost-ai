"use client";

import { CanvasClient } from "@/components/editor/canvas-client";

interface WorkspaceCanvasProps {
  roomId: string;
}

export function WorkspaceCanvas({ roomId }: WorkspaceCanvasProps) {
  return <CanvasClient roomId={roomId} />;
}