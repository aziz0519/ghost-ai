import { Liveblocks, type Liveblocks as LiveblocksClient } from "@liveblocks/node";
import type { UserMeta, Presence } from "@/liveblocks.config";

// Create a cached Liveblocks client for the server
// This ensures a single instance is used across requests
let liveblocksClient: LiveblocksClient | null = null;

function getLiveblocksClient(): LiveblocksClient {
  if (!liveblocksClient) {
    liveblocksClient = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });
  }
  return liveblocksClient;
}

export type { UserMeta, Presence };

export {
  getLiveblocksClient,
  type LiveblocksClient,
};