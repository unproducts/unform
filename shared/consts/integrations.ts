const IntegrationTypeEnum = {
  Webhook: 0,
  Email: 1,
  Telegram: 2,
  Whatsapp: 3,
  GoogleSheets: 4,
  Discord: 5,
} as const;

const IntegrationIcons: Record<keyof typeof IntegrationTypeEnum, string> = {
  Webhook: 'material-symbols:webhook',
  Email: 'ic:outline-email',
  Telegram: 'logos:telegram',
  Whatsapp: 'logos:whatsapp-icon',
  GoogleSheets: 'simple-icons:googlesheets',
  Discord: 'logos:discord-icon',
} as const;

const IntegrationDescriptions: Record<keyof typeof IntegrationTypeEnum, string> = {
  Webhook: 'Send form submissions to a webhook',
  Email: 'Send form submissions to an email',
  Telegram: 'Send form submissions to a Telegram channel',
  Whatsapp: 'Send form submissions to a WhatsApp number',
  GoogleSheets: 'Send form submissions to a Google Sheet',
  Discord: 'Send form submissions to a Discord channel',
} as const;

const IntegrationNames: Record<keyof typeof IntegrationTypeEnum, string> = {
  Webhook: 'Webhook',
  Email: 'Email',
  Telegram: 'Telegram',
  Whatsapp: 'Whatsapp',
  GoogleSheets: 'Google Sheets',
  Discord: 'Discord',
} as const;

export const IntegrationTypes = Object.keys(IntegrationTypeEnum).map((key) => {
  const id = key as keyof typeof IntegrationTypeEnum;
  return {
    id,
    name: IntegrationNames[id],
    type: IntegrationTypeEnum[id],
    icon: IntegrationIcons[id],
    description: IntegrationDescriptions[id],
  };
});
export type IntegrationType = (typeof IntegrationTypes)[number];
