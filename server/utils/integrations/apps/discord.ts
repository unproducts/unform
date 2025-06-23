import { IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

export default defineIntegration(IntegrationApps.Discord, async (options) => {
  console.log('Discord integration handler called with options:', options);
});
