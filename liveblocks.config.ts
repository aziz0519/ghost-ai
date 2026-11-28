// Presence tracks cursor position and thinking state
export type Presence = {
  userId?: string;
  name?: string;
  avatar?: string;
  cursorColor?: string;
  isThinking?: boolean;
  cursor: { x: number; y: number } | null;
  presenceId: string;
};

// UserMeta stores user identification
export type UserMeta = {
  userId: string;
  name: string;
  avatar: string;
  cursorColor: string;
};

// Type Liveblocks globally for automatic inference
declare global {
  interface Liveblocks {
    Presence: Presence;
    UserMeta: {
      id: string;
      info: UserMeta;
    };
  }
}

// Necessary if you have no imports/exports
export {};