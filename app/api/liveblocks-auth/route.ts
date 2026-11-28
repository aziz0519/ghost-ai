import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLiveblocksClient } from "@/lib/liveblocks";
import { checkProjectAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  try {
    // 1. Require Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const room = "room" in body ? body.room : undefined;
    const requestedProjectId = "projectId" in body ? body.projectId : undefined;
    const projectId =
      typeof room === "string"
        ? room.trim()
        : typeof requestedProjectId === "string"
          ? requestedProjectId.trim()
          : "";

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // 2. Verify project access using the existing access helper
    const access = await checkProjectAccess(projectId);

    if (!access.allowed || !access.projectExists) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Ensure the Liveblocks room exists (create only if needed)
    const liveblocks = getLiveblocksClient();

    // Try to get room, if it doesn't exist create it
    try {
      await liveblocks.getRoom(projectId);
    } catch {
      // Room doesn't exist, create it
      await liveblocks.createRoom(projectId, {
        defaultAccesses: [],
        metadata: {
          projectId,
        },
      });
    }

    // 4. Get user info from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.username || user.emailAddresses[0]?.emailAddress || "Unknown User";

    const userAvatar = user.imageUrl || "";

    // Generate deterministic cursor color from user ID
    const cursorColor = getCursorColor(userId);

    // 5. Create session token with user metadata
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        userId,
        name: userName,
        avatar: userAvatar,
        cursorColor,
      },
    });

    // Allow full access to the room
    session.allow(projectId, ["*:write"]);

    const { body: sessionBody, status } = await session.authorize();

    return new Response(sessionBody, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Deterministically map a user ID to a consistent color from a fixed palette
function getCursorColor(userId: string): string {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#FFE66D", // Yellow
    "#95E1D3", // Mint
    "#F38181", // Coral
    "#AA96DA", // Purple
    "#FCBAD3", // Pink
    "#A8D8EA", // Sky Blue
    "#FFD3B6", // Peach
    "#C7EFCF", // Light Green
    "#FFB7B2", // Light Red
    "#B5EAD7", // Light Teal
    "#FFDAC1", // Light Orange
    "#D7BDE2", // Light Purple
    "#FAD2E1", // Light Pink
    "#B8E1F4", // Light Sky Blue
  ];

  // Simple hash function to deterministically pick a color
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}