import {Router} from "express";
import {
  getNotificationByMerchantId, processNotify,
  resendNotificationByCallbackId
} from "../service/notification_service";
import {logger} from "../configuration/Logging";
import {NotificationRequestInboundModel} from "../model/inbound/notification_request";

const router = Router();

export default router;

router.post('/callback/:id/resend', (req, res, next) => {
  resendNotificationByCallbackId(req.params.id)
  .then(success => {
    res.status(200);
    res.json({"success": success})
    next()
  }).catch(err => {
    logger.error("Error resend with callback id: %s , err: %s", req.params.id, err);
    next(err);
  })
})

router.get('/merchant/:id', (req, res, next) => {
  getNotificationByMerchantId(req.params.id)
  .then(notifications => {
    res.status(200);
    res.json(notifications)
    next();
  }).catch(err => {
    logger.error("Error getNotificationByMerchantId id %s err %s", req.params.id, err);
    next(err);
  })
})

router.post('/send', (req, res, next) => {
  const requestBody: NotificationRequestInboundModel = {
    merchantId: req.body.merchantId,
    eventName: req.body.eventName,
    body: req.body.body
  }
  processNotify(requestBody)
  .then(success => {
    res.status(200)
    .json({success: success})
    next();
  }).catch(err => {
    logger.error("Error sending notification request %s err %s", req.body, err);
    next(err);
  })
})

router.post('/callback-example', ((req, res, next) => {
  console.log(req.body);
  res.status(200)
  .json({message: "success"})
  next();
}))