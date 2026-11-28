import type { Node, Edge } from "@xyflow/react";

// Node data structure for canvas nodes
export interface CanvasNodeData {
  label: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond";
  [key: string]: unknown;
}

// Edge data structure
export interface CanvasEdgeData {
  [key: string]: unknown;
}

// Custom node type name
export const CANVAS_NODE_TYPE = "canvasNode";
export const CANVAS_EDGE_TYPE = "canvasEdge";

// Typed node and edge for the canvas
export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>;
export type CanvasEdge = Edge<CanvasEdgeData, typeof CANVAS_EDGE_TYPE>;