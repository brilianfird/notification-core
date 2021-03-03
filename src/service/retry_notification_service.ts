import {RetryNotificationRequest} from "../model/inbound/retry_notification_request";
import {
  getAndRemoveAllNotificationEntitiesWithNextRetryLeastThanNow,
  saveRetryNotificationEntity
} from "../repository/retry_notification_repository";
import {serverProperties} from "../configuration/Properties";
import BusinessException from "../model/BusinessException";
import {resendNotificationByCallbackId} from "./notification_service";

const RETRY_DELAY_IN_MINUTES = serverProperties.get("retry.delay")

export async function saveRetryNotification(request: RetryNotificationRequest) {
  let date = new Date();
  if (RETRY_DELAY_IN_MINUTES != null) {
    date.setMinutes(date.getMinutes() + +RETRY_DELAY_IN_MINUTES)
    return saveRetryNotificationEntity({callbackId: request.callbackId, nextRetry: date})
  } else {
    throw new BusinessException("retry delay is not set", 400);
  }
}

export async function runRetryNotifications() {
  return getAndRemoveAllNotificationEntitiesWithNextRetryLeastThanNow()
  .then(retryNotifications => {
    retryNotifications.forEach(retryNotification => {
      resendNotificationByCallbackId(retryNotification.callbackId);
    });

    return true;
  })
}