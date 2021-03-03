import {serverProperties} from "../configuration/Properties";
import {newMQConnection} from "../configuration/MqConfiguration";
import {logger} from "../configuration/Logging";
import {SendNotificationOutboundModel} from "../model/outbound/send_notification_outbound_model";

const QUEUE_NAME: string = String(serverProperties.get('mq.send.notification.queue.name'));

export async function publishToSendNotificationQueue(data: SendNotificationOutboundModel) {
  const body = JSON.stringify(data);
  logger.info("Sending data to SendNotification queue %s", body)
  return newMQConnection()
  .then(ch => {
    ch.sendToQueue(QUEUE_NAME, Buffer.from(body));
    return true;
  });
}