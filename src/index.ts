import express from 'express'
import {connectMongoose} from "./configuration/Mongoose";
import bodyParser from "body-parser";
import EventRoute from "./routes/event_route"
import VerificationTokenRoute from "./routes/verification_token_routes"
import WebhookRoute from "./routes/webhook_routes"
import NotificationRoute from "./routes/notification_routes"
import RetryNotificationRoute from "./routes/retry_notification_routes"
import {businessException, errorHandler} from "./routes/exception_routes";
import {listenNotification} from "./pooling/SendNotificationListener";
import {listenRetryNotification} from "./pooling/RetryNotificationListener";

const app = express();

app.use(bodyParser.json());
app.use('/v1/events', EventRoute);
app.use('/v1/verification-tokens', VerificationTokenRoute)
app.use('/v1/webhooks', WebhookRoute)
app.use('/v1/notifications', NotificationRoute)
app.use('/v1/retry-notifications', RetryNotificationRoute)
app.use(businessException)
app.use(errorHandler)

connectMongoose()
.then(() => {
  listenNotification();
  listenRetryNotification();
  app.listen(8080);
})
