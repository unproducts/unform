import { IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

export default defineIntegration(IntegrationApps.Webhook, async (options) => {
  console.log('Webhook integration handler called with options:', options);
});
