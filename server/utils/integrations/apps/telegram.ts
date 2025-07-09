import { FormValidationSchemas, IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

export default defineIntegration(IntegrationApps.Telegram, async (options) => {
  const data = options.integrationConfig.data as Zod.infer<typeof FormValidationSchemas.Telegram>;
  const { botToken, chatId } = data;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await $fetch(url, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: 'message',
      },
    });
  } catch (error: any) {
    console.error('Failed to send Telegram message:', {
      errorBody: error.data,
    });
    throw new Error('Telegram message sending failed');
  }
});
