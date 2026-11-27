# Feature Specs 09 - Share Dialog

## Summary

Add sharing to the workspace so project owners can invite collaborators by email.

## Share Dialog

Add a `Share` button to the editor navbar that opens the share dialog.

Owners can:

- invite collaborators by email
- view current collaborators
- remove collaborators
- copy the project link with temporary `Copied!` feedback

Collaborators can:

- view the collaborator list only
- not invite, remove, or manage access

## Clerk User Data

Collaborators are stored by email in the database.

Use Clerk Backend API to enrich collaborator emails with:

- display name
- avatar image

If a Clerk user is not found for an email, fall back to showing the email only.

## Implementation

Add the required API logic for:

- listing collaborators
- inviting collaborators
- removing collaborators

Enforce ownership server-side for invite and remove actions.

Do not add a local user table.

## Check When Done

- share dialog opens from the workspace
- owners can invite and remove collaborators
- collaborators see read-only access
- collaborator names/avatars load from Clerk when available
- `npm run build` passes

## Implementation Details

### Directory Structure

- `components/editor/share-dialog.tsx` - Share dialog component (owner/collaborator views)
- `app/api/projects/[projectId]/collaborators/route.ts` - GET (list), POST (invite)
- `app/api/projects/[projectId]/collaborators/[collaboratorId]/route.ts` - DELETE (remove)

### UI/UX

- Share button in top navbar (pinned to right side alongside UserButton)
- Dialog with two sections: Invite section (owner only) and Collaborators list
- Copy project link with 2-second "Copied!" feedback
- Error display via `role="alert"` for accessibility
- Loading states for API operations
- Responsive design matching existing shadcn/ui dark theme

### Collaboration Model

- Projects have owner (Clerk user) and collaborators (email-based)
- Collaborators stored in `project_collaborators` table with unique `(projectId, email)`
- Access control: owner can invite/remove, collaborators view-only
- No local user table - all user data from Clerk Backend API

### API Design

#### GET /api/projects/[projectId]/collaborators
- Returns enriched collaborator list with display name/avatar from Clerk when available
- Fallback to email when Clerk user not found
- Returns 401 for unauthenticated users
- Returns 404 if project not found
- Returns 403 for unauthorized access
- Returns array of: `{ id, email, name, avatarUrl }`

#### POST /api/projects/[projectId]/collaborators
- Invites new collaborator by email
- Requires owner permission (403 for non-owners)
- 409 if collaborator already invited
- 400 for invalid email format
- Returns enriched collaborator data (201)

#### DELETE /api/projects/[projectId]/collaborators/[collaboratorId]
- Removes collaborator
- Requires owner permission (403 for non-owners)
- 404 if collaborator not found or doesn't belong to project
- Returns success (200)

### Technical Constraints

- Next.js 16.2.10 App Router with Turbopack
- Route handler params are `Promise<{...}>` and MUST be awaited
- Clerk auth: `auth()` from `@clerk/nextjs/server` returns `{ userId }`
- Clerk Backend API: `clerkClient` is a FUNCTION returning a Promise
- Must use `const client = await clerkClient();` then `client.users.getUserList(...)`
- Server Components for data fetching; client components for interactivity
- shadcn/ui primitives (Dialog, Button, Input, ScrollArea, Tabs)
- Tailwind dark-only theme with CSS variables
- Use Zod for input validation

### Ownership Model

- A project is owned by a Clerk user (`ownerId`)
- Collaborators are tracked by email in `project_collaborators` table
- Owners can invite/remove collaborators
- Collaborators have view-only access to the workspace
- No local user table - all user metadata from Clerk Backend API

### Error Handling

- All API routes return JSON with `error` field for failures
- HTTP status codes match standard REST conventions
- Error messages are user-friendly and descriptive
- Client-side error display with `role="alert"` for accessibility

### Security Considerations

- Server-side ownership enforcement for all invite/remove operations
- Input validation with Zod for email addresses
- Rate limiting should be implemented (not included in this spec)
<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:3de7ed6e95c48582425fcf0bf7ed75887b212237ed50f34ac59221d4223d9929 -->

- Collaborator email addresses are stored directly in `ProjectCollaborator.email` and used as email addresses for Clerk profile enrichment.

<!-- /coderabbit-ai-generated:v1 -->
- Access control verified for each operation

## References

- `lib/project-access.ts` - Helper functions for project access control
- `lib/prisma.ts` - Prisma singleton connection
- `types/project-types.ts` - Shared Project type definitions