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

export const formResponseSchema = z.object({
  id: z.string().uuid(),
  data: z.any(),
  createdAt: z.string().datetime(),
});
export type FormResponse = z.infer<typeof formResponseSchema>;

export const formResponsesSchema = z.array(formResponseSchema);
export type FormResponses = z.infer<typeof formResponsesSchema>;

export const formDomainSchema = z.object({
  id: z.string().uuid(),
  domain: z.string().url().min(1).max(255),
  createdAt: z.string().datetime(),
});
export type FormDomain = z.infer<typeof formDomainSchema>;

export const formDomainsSchema = z.array(formDomainSchema);
export type FormDomains = z.infer<typeof formDomainsSchema>;

export const createFormDomainSchema = formDomainSchema.omit({ id: true, createdAt: true });
export const updateFormDomainSchema = formDomainSchema.omit({ id: true, createdAt: true }).partial();

export const formIntegrationSchema = z.object({
  id: z.string().uuid(),
  integrationId: z.string().uuid(),
  createdAt: z.string().datetime(),
});
export type FormIntegration = z.infer<typeof formIntegrationSchema>;
export const createFormIntegrationSchema = formIntegrationSchema.omit({ id: true, createdAt: true });
export const updateFormIntegrationSchema = formIntegrationSchema.omit({ id: true, createdAt: true }).partial();
