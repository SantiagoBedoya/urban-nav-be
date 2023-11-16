import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';

@injectable({scope: BindingScope.TRANSIENT})
export class WebsocketService {
  private wsURL: string = process.env.WS_URL!;
  constructor() {}

  async sendNotification(recipients: string[], data: Record<string, string>, emitTopic: string) {
    return axios.post(this.wsURL + '/send-notification', {
      recipients,
      data,
      emitTopic
    });
  }
}
