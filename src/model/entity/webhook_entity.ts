import {Model, model, Schema, Document} from "mongoose";

const webhookSchema = new Schema<WebhookDocument, WebhookModel>({
  merchantId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

export interface Webhook {
  merchantId: string,
  url: string,
  eventName: string,
  enabled: boolean
}

interface WebhookDocument extends Event, Document {
  merchantId: string,
  url: string,
  eventName: string,
  enabled: boolean
}

export interface WebhookModel extends Model<WebhookDocument> {

}

export default model<WebhookDocument, WebhookModel>("Webhook", webhookSchema)