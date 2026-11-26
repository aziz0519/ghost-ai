# Prisma Schema And Data Layer

## Goal

Prisma is already installed. Add the project data models, Prisma client singleton, and first migration.

## Models

Create `prisma/models/project.prisma`.

Add `Project`:

- owner ID mapped to Clerk user
- name
- optional description
- status enum: `DRAFT`, `ARCHIVED`
- `canvasJsonPath` for future canvas blob storage
- timestamps
- indexes on owner ID and creation date

Add `ProjectCollaborator`:

- project relation with cascade delete
- collaborator email
- creation timestamp
- unique constraint on project/email
- indexes on email and project/date

Do not add extra fields unless required by Prisma.

## Prisma Client

Create `lib/prisma.ts` as a cached singleton.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:a552c152840b5679737b6a37ba67283e6d93b7fa4a751bd061459cad7db6fc64 -->

With Prisma v5, construct the client using `new PrismaClient()` and the PostgreSQL `DATABASE_URL` configured in `prisma/schema.prisma`. The client does not branch on the URL or configure an adapter or Accelerate. `@prisma/adapter-pg` is installed but is not required for this implementation.

<!-- /coderabbit-ai-generated:v1 -->

Cache the client on `global` in development for hot reloads.

## Migration

Run the migration and generate the client.

## Dependencies

Already installed:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## Check When Done

- schema has both models with correct relations and indexes
- `lib/prisma.ts` exports one cached Prisma instance
- migration runs successfully
- `npm run build` passes
