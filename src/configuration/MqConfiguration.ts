import amqp from "amqplib/callback_api";

import {serverProperties} from "./Properties";

const CONN_URL: string = String(serverProperties.get("mq.uri"));

export async function newMQConnection() {
  return new Promise<amqp.Channel>(((resolve, reject) => {
    amqp.connect(CONN_URL, function (err, conn) {
      conn.createChannel(function (err, channel) {
        if (err == null) {
          resolve(channel);
        }

        reject(err);
      });
    });
  }))
}
