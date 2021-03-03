import {Model, model, Schema, Document} from "mongoose";

const notificationSchema = new Schema<NotificationDocument, NotificationModel>({
  url: {
    type: String,
    required: true,
  },
  callbackId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  body: {
    type: Object,
    required: true
  },
  merchantId: {
    type: String,
    required: true
  }
});

export interface Notification {
  url: string,
  callbackId: string,
  token: string,
  timestamp: Date,
  body: object,
  merchantId: string
}

interface NotificationDocument extends Notification, Document {
  url: string,
  callbackId: string,
  token: string,
  timestamp: Date,
  retryAttempt: number,
  nextAttempt: Date,
  body: object,
  merchantId: string
}

export interface NotificationModel extends Model<NotificationDocument> {

}

export default model<NotificationDocument, NotificationModel>("Notification", notificationSchema)