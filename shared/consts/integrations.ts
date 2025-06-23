import { z } from 'zod';

export const IntegrationApps = {
  Webhook: 0,
  Email: 1,
  Telegram: 2,
  Whatsapp: 3,
  GoogleSheets: 4,
  Discord: 5,
} as const;
export type IntegrationApp = keyof typeof IntegrationApps;
export type IntegrationAppId = (typeof IntegrationApps)[IntegrationApp];

// List of integrations that are implemented.
const WhitelistedIntegrationApps = [
  IntegrationApps.Webhook,
  IntegrationApps.Email,
  IntegrationApps.Telegram,
  IntegrationApps.Discord,
];

const IntegrationAppIcons: Record<IntegrationApp, string> = {
  Webhook: 'material-symbols:webhook',
  Email: 'ic:outline-email',
  Telegram: 'logos:telegram',
  Whatsapp: 'logos:whatsapp-icon',
  GoogleSheets: 'simple-icons:googlesheets',
  Discord: 'logos:discord-icon',
} as const;

const IntegrationAppDescriptions: Record<IntegrationApp, string> = {
  Webhook: 'Sends form submissions to a webhook',
  Email: 'Sends form submissions to an email',
  Telegram: 'Sends form submissions to a Telegram channel',
  Whatsapp: 'Sends form submissions to a WhatsApp number',
  GoogleSheets: 'Sends form submissions to a Google Sheet',
  Discord: 'Sends form submissions to a Discord channel',
} as const;

const IntegrationAppNames: Record<IntegrationApp, string> = {
  Webhook: 'Webhook',
  Email: 'Email',
  Telegram: 'Telegram',
  Whatsapp: 'Whatsapp',
  GoogleSheets: 'Google Sheets',
  Discord: 'Discord',
} as const;

export const EmailProviderTypes = {
  ListMonk: 0,
  Mailgun: 1,
  SendGrid: 2,
  Postmark: 3,
  Mailjet: 4,
  Sendinblue: 5,
  Mailchimp: 6,
  Resend: 7,
} as const;

export const FormValidationSchemas: Record<IntegrationApp, Zod.ZodSchema> = {
  Webhook: z.object({
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
  Email: z.object({
    provider: z.number().int().min(0).max(7),
    email: z.string().email(),
    emailSubject: z.string().optional(),
    replyTo: z.string().email().optional(),
    providerKey: z.string(),
    includeFormData: z.boolean().optional(),
  }),
  Telegram: z.object({
    botToken: z.string(),
    chatId: z.string(),
  }),
  Whatsapp: z.object({
    apiKey: z.string(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    phoneId: z.string(),
    messageTemplate: z.string(),
  }),
  GoogleSheets: z.object({
    spreadsheetId: z.string(),
    sheetName: z.string(),
  }),
  Discord: z.object({
    webhookUrl: z.string().url(),
    botUsername: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    embedColor: z.string().optional(),
  }),
} as const;

export const Integrations = Object.keys(IntegrationApps)
  // @ts-expect-error TODO: Fix this
  .filter((key) => WhitelistedIntegrationApps.includes(IntegrationApps[key]))
  .map((key) => {
    const id = key as IntegrationApp;
    return {
      id,
      name: IntegrationAppNames[id],
      type: IntegrationApps[id],
      icon: IntegrationAppIcons[id],
      description: IntegrationAppDescriptions[id],
      formValidationSchema: FormValidationSchemas[id],
    };
  });
export type Integration = (typeof Integrations)[number];

export const getIntegration = (type: number) => {
  const integration = Integrations.find((integration) => integration.type === type);
  if (!integration) {
    throw new Error(`Integration with type ${type} not found`);
  }
  return integration;
};
