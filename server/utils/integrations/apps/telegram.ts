import { IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

export default defineIntegration(IntegrationApps.Telegram, async (options) => {
  console.log('Telegram integration handler called with options:', options);
});
