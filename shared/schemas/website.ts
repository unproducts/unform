import { z } from 'zod';

export const websiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  domain: z.string().url().min(1).max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Website = z.infer<typeof websiteSchema>;

export const createWebsiteSchema = websiteSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateWebsiteSchema = websiteSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial();
