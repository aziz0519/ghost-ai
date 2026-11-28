"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { ReactFlow, MiniMap, Background, BackgroundVariant, ConnectionMode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useId } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

interface CanvasClientProps {
  roomId: string;
}

function CanvasContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
  });

  return (
    <ReactFlow<CanvasNode, CanvasEdge>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      fitView
      connectionMode={ConnectionMode.Loose}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1}
        color="#88888820"
      />
      <MiniMap
        nodeColor="#88888840"
        nodeBorderRadius={4}
        nodeStrokeWidth={1.5}
        maskColor="rgba(0,0,0,0.08)"
      />
    </ReactFlow>
  );
}

export function CanvasClient({ roomId }: CanvasClientProps) {
  const presenceId = useId();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async () => []}
      resolveMentionSuggestions={async () => []}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null, presenceId }}>
        <ClientSideSuspense
          fallback={<div className="flex h-full w-full items-center justify-center">Loading canvas...</div>}
        >
          <div className="h-full w-full">
            <CanvasContent />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}