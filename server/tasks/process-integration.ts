import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';
import { formIntegrationConfigsTable, formResponsesTable, formsTable, integrationConfigsTable } from '../db/schema';
import { runIntegration } from '../utils/integrations';
import { IntegrationConfig } from '~~/shared/schemas/integration';
import { Form, FormResponse } from '~~/shared/schemas/form';

export default defineTask({
  meta: {
    name: 'process-integration',
    description: 'Process integration',
  },
  async run({ payload }) {
    console.log('[process-integration] Starting task with payload:', payload);

    const params = z
      .object({
        responseId: z.string(),
      })
      .parse(payload);
    const { responseId } = params;
    console.log('[process-integration] Parsed responseId:', responseId);

    const db = await useDatabase();
    console.log('[process-integration] Database connection established');

    // Fetch response and form first
    console.log('[process-integration] Fetching response with form...');
    const [responseWithForm] = await db
      .select({
        formResponse: formResponsesTable,
        form: formsTable,
      })
      .from(formResponsesTable)
      .leftJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formResponsesTable.id, responseId));
    console.log('[process-integration] Response with form fetched:', responseWithForm);

    if (!responseWithForm?.formResponse || !responseWithForm.form) {
      console.error('[process-integration] Response or form not found for ID:', responseId);
      throw new Error(`Response or form not found for response ID: ${responseId}`);
    }

    const { formResponse, form } = responseWithForm;
    console.log('[process-integration] Extracted relations:', {
      responseId: formResponse.id,
      formId: form.id,
    });

    // Fetch all form integrations
    console.log('[process-integration] Fetching form integrations...');
    const formIntegrations = await db
      .select()
      .from(formIntegrationConfigsTable)
      .where(eq(formIntegrationConfigsTable.formId, form.id));
    console.log('[process-integration] Found form integrations:', formIntegrations.length);

    if (formIntegrations.length === 0) {
      console.log('[process-integration] No integrations found for form:', form.id);
      return {
        result: 'No integrations found for this form',
        processedIntegrations: 0,
      };
    }

    // Fetch all related integrations in a single query
    console.log('[process-integration] Fetching integrations...');
    const integrationConfigs = await db
      .select()
      .from(integrationConfigsTable)
      .where(
        inArray(
          integrationConfigsTable.id,
          formIntegrations.map((fi) => fi.integrationConfigId)
        )
      );
    console.log('[process-integration] Found integrations:', integrationConfigs.length);

    // Process each integration
    console.log('[process-integration] Starting to process integrations...');
    await Promise.all(
      integrationConfigs.map((integrationConfig) =>
        applyIntegration({
          integrationConfig,
          formResponse,
          form,
          db,
        })
      )
    );

    console.log('[process-integration] All integrations processed successfully');
    return {
      result: 'Integration processed successfully',
      processedIntegrations: integrationConfigs.length,
    };
  },
});

// Helper function to process individual integrations
async function applyIntegration({
  integrationConfig,
  formResponse,
  form,
  db,
}: {
  integrationConfig: IntegrationConfig;
  formResponse: FormResponse;
  form: Form;
  db: Awaited<ReturnType<typeof useDatabase>>;
}) {
  console.log('[process-integration] Starting applyIntegration for:', {
    integrationId: integrationConfig.id,
    formResponseId: formResponse.id,
    formId: form.id,
  });
  await runIntegration({
    integrationConfig,
    formResponse,
    form,
    db,
  });
}
