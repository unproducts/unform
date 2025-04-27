import { z } from 'zod';

export const formSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Form = z.infer<typeof formSchema>;

export const createFormSchema = formSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateFormSchema = formSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial();
