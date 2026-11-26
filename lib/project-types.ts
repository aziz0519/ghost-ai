export interface Project {
  id: string;
  name: string;
  slug?: string;
  ownerId: string;
  description?: string | null;
  collaborators?: Array<{ email: string }>;
}