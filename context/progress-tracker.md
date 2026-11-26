# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Implemented

## Current Goal

- Complete the project dialogs and editor home implementation with Create, Rename, Delete dialogs, sidebar actions, and slug preview.

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

## In Progress

- None at the moment.

## Next Up

- Extend the authenticated editor experience with additional panels and editor-specific interactions as new features are added.
- Implement Prisma schema and project APIs (05-prisma.md, 06-project-apis.md).

## Open Questions

- None at the moment.

## Architecture Decisions

- Use shadcn/ui primitives in the shared components/ui layer with Tailwind-based dark theme variables from globals.css.
- Keep editor chrome as reusable shared components under the components/editor layer so subsequent editor screens can compose them consistently.
- Wrap the app with ClerkProvider and protect routes through a shared auth gate so the auth experience stays centralized and consistent.
- Use a dedicated hook (`useProjectDialogs`) to manage all project dialog state, form state, and loading state.
- Keep mock data in the sidebar component for now; replace with API calls in future chapters.

## Session Notes

- Follow the existing dark-only UI context and avoid modifying generated components/ui files after installation.
- The editor navbar and project sidebar are intentionally lightweight and reusable for future editor chapters.
- Clerk auth pages should remain minimal and use the existing CSS variables rather than hardcoded colors.
- Dialog components use the existing shadcn dialog primitives with the dark theme styling.
- Slug preview generates automatically from project name using lowercase, hyphen-separated format.