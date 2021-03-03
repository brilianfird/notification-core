import NotificationModel, {Notification} from "../model/entity/notification_entity";

export async function saveNotificationEntity(notification: Notification) {
  return NotificationModel.create(notification)
  .then(value =>value.toObject());
}

export async function getNotificationEntityByCallbackId(callbackId: string) {
    return NotificationModel.findOne({"callbackId": callbackId})
    .then(document => {
      if (document == null) {
        return null;
      }
       return document.toObject();
    })
}

export async function getNotificationEntitiesByMerchantId(merchantId: string) {
  return NotificationModel.find({"merchantId": merchantId})
  .then(document => {
    let notifications: Array<Notification> = new Array();
    if (document.length == 0) {
      return notifications;
    }

    document.forEach(doc => {
      notifications.push(doc.toObject());
    })
    return notifications;
  })
}