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
  SendGrid: 1,
  Postmark: 2,
  Mailjet: 3,
  Mailchimp: 4,
  Resend: 5,
  MailerSend: 6,
} as const;

export const FormValidationSchemas = {
  Webhook: z.object({
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
  Email: z.object({
    provider: z.nativeEnum(EmailProviderTypes),
    providerKey: z.string().min(1, 'Provider API key is required'),
    senderEmail: z.string().email('Please enter a valid sender email'),
    senderName: z.string().min(1, 'Sender name is required'),
    recipients: z
      .array(z.string().email('Please enter valid recipient email(s)'))
      .min(1, 'At least one recipient is required'),
    cc: z.array(z.string().email('Please enter valid CC email(s)')).optional(),
    bcc: z.array(z.string().email('Please enter valid BCC email(s)')).optional(),
    emailSubject: z.string().min(1, 'Email subject is required'),
    replyTo: z.string().email('Please enter a valid reply-to email').optional(),
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
