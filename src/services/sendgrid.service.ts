import {BindingScope, injectable} from '@loopback/core';
import sgMail from '@sendgrid/mail';

@injectable({scope: BindingScope.TRANSIENT})
export class SendgridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
  }

  async sendMail(to: string, templateId: string, data: Record<string, string>) {
    await sgMail.send({
      to,
      templateId,
      from: process.env.SENDGRID_FROM ?? '',
      dynamicTemplateData: data,
    });
  }
}
