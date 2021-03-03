import {Model, model, Schema, Document} from "mongoose";

const retryNotificationSchema = new Schema<RetryNotificationDocument, RetryNotificationModel>({
  callbackId: {
    type: String,
    required: true,
    unique: true
  },
  nextRetry: {
    type: Date,
    required: true
  }
});

export interface RetryNotification {
  callbackId: string,
  nextRetry: Date
}

interface RetryNotificationDocument extends RetryNotification, Document {
  callbackId: string,
  nextRetry: Date
}

export interface RetryNotificationModel extends Model<RetryNotificationDocument> {

}

export default model<RetryNotificationDocument, RetryNotificationModel>("RetryNotification", retryNotificationSchema)