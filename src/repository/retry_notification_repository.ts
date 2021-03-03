import RetryNotificationModel, {RetryNotification} from "../model/entity/retry_notification_entity";

export async function saveRetryNotificationEntity(request: RetryNotification) {
  return RetryNotificationModel.create(request)
    .then(value => value.toObject());
}

export async function getAndRemoveAllNotificationEntitiesWithNextRetryLeastThanNow() {
  return RetryNotificationModel.find({"nextRetry": {$lte: new Date()}})
    .then(docs => {
      const retryNotifications: Array<RetryNotification> = new Array<RetryNotification>();
      const ids: Array<String> = new Array<String>();
      docs.forEach(doc => {
        ids.push(doc._id);
        retryNotifications.push(doc.toObject());
      })

      return RetryNotificationModel.deleteMany({"_id": {$in: ids}})
        .then(() => retryNotifications);
    })
}