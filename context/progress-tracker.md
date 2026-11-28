# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Implemented

## Current Goal

- Extend the authenticated editor experience with additional panels and editor-specific interactions as new features are added.

## Completed

- Installed shadcn/ui configuration and the requested UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea.
- Added the shared cn helper and wired the app to a dark-only theme using the global CSS variables.
- Updated the home page to preview the new primitives in a dark themed layout.
- Implemented the editor chrome foundation with a fixed navbar, project sidebar shell, and reusable editor shell container.
- Added the dialog pattern support through the existing shadcn dialog primitives with dark-themed surfaces.
- Installed and wired Clerk authentication into the Next.js app with a provider wrapping the root layout.
- Added sign-in and sign-up pages built from Clerk components with a minimal two-panel dark layout.
- Added a root proxy file and auth route helpers to support public auth routes while protecting the rest of the app by default.
- Added redirect behavior so authenticated users land on /editor and unauthenticated users are sent to /sign-in.
- Added Clerk's built-in UserButton to the editor navbar for profile settings and logout.
- Verified the implementation with a successful production build.
- Created `useProjectDialogs` hook to manage dialog state, form state, and loading state for Create, Rename, and Delete project dialogs.
- Implemented Create Project dialog with project name input and live slug preview that updates as user types.
- Implemented Rename Project dialog with prefilled project name input, current name shown in description, auto-focus, and Enter to submit.
- Implemented Delete Project dialog with destructive confirmation only, no input, and destructive styling on confirm button.
- Wired editor home "New Project" button to open Create dialog.
- Wired sidebar "New Project" button to open Create dialog.
- Wired sidebar rename action (pencil icon) to open Rename dialog for owned projects only.
- Wired sidebar delete action (trash icon) to open Delete dialog for owned projects only.
- Added mobile support: tapping outside sidebar closes it with backdrop scrim.
- Used mock project data only, no API calls or persistence.
- Verified with successful production build and no lint errors.
- Created Prisma schema with `Project` and `ProjectCollaborator` models:
  - Project: ownerId (mapped to Clerk user), name, optional description, status enum (DRAFT/ARCHIVED), canvasJsonPath, timestamps, indexes on ownerId and createdAt
  - ProjectCollaborator: project relation with cascade delete, collaborator email, creation timestamp, unique constraint on project/email, indexes on email and project/date
- Created `lib/prisma.ts` as a cached singleton with global caching for development hot reloads
- Ran migration successfully (20261126034813_init) - database is in sync with schema
- Generated Prisma Client successfully
- Verified with successful production build and no lint errors.
- Implemented project API routes:
  - `GET /api/projects` - list current user's projects with collaborators
  - `POST /api/projects` - create project (defaults name to "Untitled Project")
  - `PATCH /api/projects/[projectId]` - rename/update project (owner only)
  - `DELETE /api/projects/[projectId]` - delete project (owner only)
- Security enforced:
  - Unauthenticated requests return 401
  - Only project owner can rename or delete (returns 403 for non-owners)
  - Project not found returns 404
- Implemented editor workspace shell (`/editor/[roomId]`):
  - Server component with server-side access checks using Clerk auth() and Prisma queries
  - Unauthenticated users redirected to /sign-in page
  - AccessDenied component for unauthorized/non-existent projects
  - Full-viewport three-panel layout with left sidebar (ProjectSidebar), central canvas placeholder, right sidebar (AI Assistant) placeholder
  - Top navbar with project name, share button, and AI sidebar toggle
  - Current room highlighted in sidebar with primary border/bg
  - Shared Project interface across 4 files via lib/project-types.ts
- Verified with successful production build and no TypeScript errors.
- Wired the UI to use the project APIs (07-wire-editor-home.md):
  - useProjectActions hook calls real API routes (POST, PATCH, DELETE) and uses router.refresh for optimistic updates
  - EditorHomeClient and ProjectSidebar use the real API via useProjectActions
  - Create dialog navigates to /editor/[projectId] after creation
  - Verified with successful production build and no lint errors.

- Implemented the share dialog (09-share-dialog.md):
  - Share button in editor navbar opens share dialog
  - API routes for collaborators: GET /api/projects/[projectId]/collaborators (list), POST (invite), DELETE (remove)
  - Clerk Backend API enrichment for collaborator display names and avatars (fallback to email)
  - Server-side ownership enforcement for invite/remove operations
  - Owner sees invite input, collaborator list with remove buttons, and copy project link with "Copied!" feedback
  - Collaborator sees read-only collaborator list only
  - No local user table added - uses Clerk Backend API directly
  - Verified with successful production build and no TypeScript errors.
  - Updated listing access to recognize verified primary emails, reset dialog state per session, block mutations during the initial load, and provide manual copying on clipboard failure.



## In Progress

- None

## Next Up

- Extend the authenticated editor experience with additional panels and editor-specific interactions as new features are added.

## Open Questions

- None at the moment.

## Architecture Decisions

- Use shadcn/ui primitives in the shared components/ui layer with Tailwind-based dark theme variables from globals.css.
- Keep editor chrome as reusable shared components under the components/editor layer so subsequent editor screens can compose them consistently.
- Wrap the app with ClerkProvider and protect routes through a shared auth gate so the auth experience stays centralized and consistent.
- Use a dedicated hook (`useProjectDialogs`) to manage all project dialog state, form state, and loading state.
- Keep mock data in the sidebar component for now; replace with API calls in future chapters.
- Downgraded Prisma to v5 for stable schema configuration and migration support (v7 had breaking changes to config format)
- Prisma schema uses `datasource db` with `url = env("DATABASE_URL")` in schema.prisma (v5 standard)
- API routes use Clerk's `auth()` for authentication and enforce ownership checks

## Session Notes

- Follow the existing dark-only UI context and avoid modifying generated components/ui files after installation.
- The editor navbar and project sidebar are intentionally lightweight and reusable for future editor chapters.
- Clerk auth pages should remain minimal and use the existing CSS variables rather than hardcoded colors.
- Dialog components use the existing shadcn dialog primitives with the dark theme styling.
- Slug preview generates automatically from project name using lowercase, hyphen-separated format.
- Prisma migration created tables: projects and project_collaborators with correct indexes and constraints
- Docker PostgreSQL container used for local database
- API routes are RESTful and follow standard conventions
