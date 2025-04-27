import { z } from 'zod';

export const passwordSchema = z
  .string()
  .regex(/^.{8,}$/, 'Password must be at least 8 characters long.')
  .regex(/(?=(.*[!@#$%^&*()\-__+.]){1,})/, 'Password must contain at least 1 special character.');

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: passwordSchema,
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  isSuperAdmin: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;
