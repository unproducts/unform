import { EmailProviderTypes, FormValidationSchemas, IntegrationApps } from '~~/shared/consts/integrations';
import { defineIntegration } from '../base';

import { createUnmail, Unmail } from '@unproducts/unmail';
import MailchimpDriver from '@unproducts/unmail/drivers/mailchimp';
import MailerSendDriver from '@unproducts/unmail/drivers/mailersend';
import ResendDriver from '@unproducts/unmail/drivers/resend';
import SendgridDriver from '@unproducts/unmail/drivers/sendgrid';
import MailjetDriver from '@unproducts/unmail/drivers/mailjet';
import PostmarkDriver from '@unproducts/unmail/drivers/postmark';
import { makeDefaultMessage, makeDefaultMessageWithFormData } from './_utils';

export default defineIntegration(IntegrationApps.Email, async (options) => {
  const data = options.integrationConfig.data as Zod.infer<typeof FormValidationSchemas.Email>;

  let unmail: Unmail;

  switch (data.provider) {
    case EmailProviderTypes.Mailchimp:
      unmail = await createUnmail(
        MailchimpDriver({
          token: data.providerKey,
        })
      );
      break;
    case EmailProviderTypes.SendGrid:
      unmail = await createUnmail(
        SendgridDriver({
          token: data.providerKey,
        })
      );
      break;
    case EmailProviderTypes.Postmark:
      unmail = await createUnmail(
        PostmarkDriver({
          token: data.providerKey,
        })
      );
      break;
    // case EmailProviderTypes.Mailjet: // Mailjet requires secret key, so will need frontend changes
    //   unmail = await createUnmail(MailjetDriver({
    //     token: data.providerKey,
    //   }));
    //   break;
    case EmailProviderTypes.MailerSend:
      unmail = await createUnmail(
        MailerSendDriver({
          token: data.providerKey,
        })
      );
      break;
    case EmailProviderTypes.Resend:
      unmail = await createUnmail(
        ResendDriver({
          token: data.providerKey,
        })
      );
      break;
    default:
      throw new Error('Invalid email provider');
  }

  const recipients = data.recipients?.map((recipient) => ({ email: recipient })) || [];
  const cc = data.cc?.map((cc) => ({ email: cc })) || [];
  const bcc = data.bcc?.map((bcc) => ({ email: bcc })) || [];

  let text = makeDefaultMessage(options.form);
  if (options.integrationConfig.includeFormData) {
    text = makeDefaultMessageWithFormData(options.form, options.formResponse);
  }

  const sendMailResponse = await unmail.sendMail({
    from: {
      email: data.senderEmail,
      name: data.senderName,
    },
    to: recipients,
    cc,
    bcc,
    subject: data.emailSubject,
    replyTo: data.replyTo ? { email: data.replyTo } : undefined,
    text,
  });

  if (!sendMailResponse.success) {
    console.error(sendMailResponse);
    throw new Error('Failed to send email');
  }
});
