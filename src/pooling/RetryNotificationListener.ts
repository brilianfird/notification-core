import {Message} from "amqplib/callback_api";

import {serverProperties} from "../configuration/Properties";
import {newMQConnection} from "../configuration/MqConfiguration";
import {exception} from "console";
import {logger} from "../configuration/Logging";
import {NotificationRequestInboundModel} from "../model/inbound/notification_request";
import {processNotify} from "../service/notification_service";
import {RetryNotificationRequest} from "../model/inbound/retry_notification_request";
import {saveRetryNotification} from "../service/retry_notification_service";

const QUEUE: string = String(
  serverProperties.get("mq.retry.notification.queue.name")
);

export function listenRetryNotification() {
  newMQConnection().then(channel => {
    channel.consume(
      QUEUE,
      function (msg: Message | null) {
        if (msg != null) {
          logger.log('info', "Getting message in Retry Notification queue: %s",  msg.content.toString())
          parseMessageToObject(msg.content.toString())
            .then((val) => saveRetryNotification(val))
            .catch((err) => {
              logger.error("Error saving retry notification: %s", err)
            });
        }
      },
      { noAck: true }
    );
  });
}

async function parseMessageToObject(msg: string) {
  const retryNotificationRequest: RetryNotificationRequest = JSON.parse(
    msg
  );

  if (retryNotificationRequest.callbackId == null) {
    throw exception;
  }

  return retryNotificationRequest;
}
