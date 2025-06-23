import { getIntegration, IntegrationAppId } from '~~/shared/consts/integrations';
import { FormResponse, Form } from '~~/shared/schemas/form';
import { IntegrationConfig } from '~~/shared/schemas/integration';

export interface HandlerOptions<T extends Record<string, any> = Record<string, any>> {
  formResponse: FormResponse;
  form: Form;
  integrationConfig: IntegrationConfig<T>;
  db: Awaited<ReturnType<typeof useDatabase>>;
}

export const defineIntegration = <T extends Record<string, any> = Record<string, any>>(
  integrationAppId: IntegrationAppId,
  handler: (options: HandlerOptions<T>) => Promise<void>
) => {
  const integration = getIntegration(integrationAppId);
  console.log('Registering integration handler for:', integration.name);
  return async (options: HandlerOptions<T>) => {
    const { success, error } = integration.formValidationSchema.safeParse(options.integrationConfig.data);
    if (!success) {
      throw new Error(`Invalid integration config: ${error.message}`);
    }
    await handler(options);
  };
};
