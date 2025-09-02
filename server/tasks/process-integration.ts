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
    const params = z
      .object({
        responseId: z.string(),
      })
      .parse(payload);
    const { responseId } = params;

    const db = await useDatabase();

    // Fetch response and form first
    const [responseWithForm] = await db
      .select({
        formResponse: formResponsesTable,
        form: formsTable,
      })
      .from(formResponsesTable)
      .leftJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formResponsesTable.id, responseId));

    if (!responseWithForm?.formResponse || !responseWithForm.form) {
      throw new Error(`Response or form not found for response ID: ${responseId}`);
    }

    const { formResponse, form } = responseWithForm;

    // Fetch all form integrations
    const formIntegrations = await db
      .select()
      .from(formIntegrationConfigsTable)
      .where(eq(formIntegrationConfigsTable.formId, form.id));

    if (formIntegrations.length === 0) {
      return {
        result: 'No integrations found for this form',
        processedIntegrations: 0,
      };
    }

    // Fetch all related integrations in a single query
    const integrationConfigs = await db
      .select()
      .from(integrationConfigsTable)
      .where(
        inArray(
          integrationConfigsTable.id,
          formIntegrations.map((fi) => fi.integrationConfigId)
        )
      );

    // Process each integration
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
  await runIntegration({
    integrationConfig,
    formResponse,
    form,
    db,
  });
}
