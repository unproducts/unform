import { z } from 'zod';

export const integrationConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.number().int().min(0).max(255),
  data: z.record(z.any()),
  createdAt: z.string().datetime(),
});

export type IntegrationConfig<T extends Record<string, any> = Record<string, any>> = z.infer<
  typeof integrationConfigSchema
> & {
  data: T;
};

export const createIntegrationConfigSchema = integrationConfigSchema.omit({ id: true, createdAt: true });
export const updateIntegrationConfigSchema = integrationConfigSchema.omit({ id: true, createdAt: true }).partial();
