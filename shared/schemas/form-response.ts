import { z } from 'zod';

export const formResponseSchema = z.object({
  id: z.string().uuid(),
  data: z.any(),
  createdAt: z.string().datetime(),
});
export type FormResponse = z.infer<typeof formResponseSchema>;

export const formResponsesSchema = z.array(formResponseSchema);
export type FormResponses = z.infer<typeof formResponsesSchema>;
