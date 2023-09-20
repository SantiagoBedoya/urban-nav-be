import {BindingScope, injectable} from '@loopback/core';
const twilio = require('twilio');

@injectable({scope: BindingScope.TRANSIENT})
export class TwilioService {
  private client;
  constructor() {
    const accountSid = process.env.TWILIO_SID ?? '';
    const authToken = process.env.TWILIO_AUTH_TOKEN ?? '';
    this.client = twilio(accountSid, authToken);
  }

  /**
   *
   * @param body the body of the message
   * @param to the destinatary (should be the owner's phone for now)
   */
  async sendSms(body: string, to: string) {
    const sender = process.env.TWILIO_PHONE_NUMBER;
    try {
      const msg = await this.client.messages.create({
        to,
        body,
        from: sender,
      });
      console.log(msg);
    } catch (err) {
      console.log(err);
    }
  }
}
