import { z } from 'zod';

export const IntegrationTypeEnum = {
  Webhook: 0,
  Email: 1,
  Telegram: 2,
  Whatsapp: 3,
  GoogleSheets: 4,
  Discord: 5,
} as const;

// List of integrations that are implemented.
const WhitelistedIntegrations = [
  IntegrationTypeEnum.Webhook,
  IntegrationTypeEnum.Email,
  IntegrationTypeEnum.Telegram,
  IntegrationTypeEnum.Discord,
];

const IntegrationIcons: Record<keyof typeof IntegrationTypeEnum, string> = {
  Webhook: 'material-symbols:webhook',
  Email: 'ic:outline-email',
  Telegram: 'logos:telegram',
  Whatsapp: 'logos:whatsapp-icon',
  GoogleSheets: 'simple-icons:googlesheets',
  Discord: 'logos:discord-icon',
} as const;

const IntegrationDescriptions: Record<keyof typeof IntegrationTypeEnum, string> = {
  Webhook: 'Sends form submissions to a webhook',
  Email: 'Sends form submissions to an email',
  Telegram: 'Sends form submissions to a Telegram channel',
  Whatsapp: 'Sends form submissions to a WhatsApp number',
  GoogleSheets: 'Sends form submissions to a Google Sheet',
  Discord: 'Sends form submissions to a Discord channel',
} as const;

const IntegrationNames: Record<keyof typeof IntegrationTypeEnum, string> = {
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

export const FormValidationSchemas: Record<keyof typeof IntegrationTypeEnum, Zod.ZodSchema> = {
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

export const IntegrationTypes = Object.keys(IntegrationTypeEnum)
  // @ts-expect-error TODO: Fix this
  .filter((key) => WhitelistedIntegrations.includes(IntegrationTypeEnum[key]))
  .map((key) => {
    const id = key as keyof typeof IntegrationTypeEnum;
    return {
      id,
      name: IntegrationNames[id],
      type: IntegrationTypeEnum[id],
      icon: IntegrationIcons[id],
      description: IntegrationDescriptions[id],
      formValidationSchema: FormValidationSchemas[id],
    };
  });
export type IntegrationType = (typeof IntegrationTypes)[number];

export const getIntegrationType = (type: number) => {
  return IntegrationTypes.find((integration) => integration.type === type);
};
