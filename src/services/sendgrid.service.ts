import {BindingScope, injectable} from '@loopback/core';
import sgMail from '@sendgrid/mail';

@injectable({scope: BindingScope.TRANSIENT})
export class SendgridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
  }

  async sendMail(
    subject: string,
    to: string,
    templateId: string,
    data: Record<string, string>,
  ) {
    try {
      await sgMail.send({
        to,
        templateId,
        subject,
        from: process.env.SENDGRID_FROM ?? '',
        dynamicTemplateData: data,
      });
    } catch (err) {
      console.log(err.response.body.errors);
    }
  }
}
