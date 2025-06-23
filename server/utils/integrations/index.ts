import { getIntegration, IntegrationAppId, IntegrationApps } from '~~/shared/consts/integrations';

import telegramIntegration from './apps/telegram';
import webhookIntegration from './apps/webhook';
import emailIntegration from './apps/email';
import discordIntegration from './apps/discord';
import { HandlerOptions } from './base';

const __defaultHandler__ = async (_: unknown) => {
  throw new Error('Integration is not implemented');
};

const integrationHandlers: Record<IntegrationAppId, (options: HandlerOptions) => Promise<void>> = {
  [IntegrationApps.Webhook]: webhookIntegration,
  [IntegrationApps.Email]: emailIntegration,
  [IntegrationApps.Telegram]: telegramIntegration,
  [IntegrationApps.Discord]: discordIntegration,
  [IntegrationApps.Whatsapp]: __defaultHandler__,
  [IntegrationApps.GoogleSheets]: __defaultHandler__,
};

export const runIntegration = async (options: HandlerOptions) => {
  const handler = integrationHandlers[options.integrationConfig.type as IntegrationAppId];
  if (!handler) {
    const integration = getIntegration(options.integrationConfig.type);
    throw new Error(`Integration handler for type ${integration.name} is not defined`);
  }
  return handler(options);
};
