import { IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

export default defineIntegration(IntegrationApps.Email, async (options) => {
  console.log('Email integration handler called with options:', options);
});
