import {Message} from "amqplib/callback_api";

import {serverProperties} from "../configuration/Properties";
import {newMQConnection} from "../configuration/MqConfiguration";
import {exception} from "console";
import {logger} from "../configuration/Logging";
import {NotificationRequestInboundModel} from "../model/inbound/notification_request";
import {processNotify} from "../service/notification_service";

const QUEUE: string = String(
  serverProperties.get("mq.notification.queue.name")
);

export function listenNotification() {
  newMQConnection().then(channel => {
    channel.consume(
      QUEUE,
      function (msg: Message | null) {
        if (msg != null) {
          logger.log('info', "Getting message in notification queue: %s",  msg.content.toString())
          parseMessageToObject(msg.content.toString())
            .then((val) => processNotify(val))
            .catch((err) => {
              logger.error("Error processing notification: %s", err)
            });
        }
      },
      { noAck: true }
    );
  });
}

async function parseMessageToObject(msg: string) {
  const notificationRequestInboundModel: NotificationRequestInboundModel = JSON.parse(
    msg
  );

  if (notificationRequestInboundModel.body == null) {
    throw exception;
  }

  if (notificationRequestInboundModel.eventName == null) {
    throw exception;
  }

  if (notificationRequestInboundModel.merchantId == null) {
    throw exception;
  }

  return notificationRequestInboundModel;
}
