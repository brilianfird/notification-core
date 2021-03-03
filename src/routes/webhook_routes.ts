import {Router} from "express";
import {logger} from "../configuration/Logging";
import {WebhookRequest} from "../model/inbound/webhook_request";
import {getWebhooksByMerchantId, saveWebhook, updateWebhook} from "../service/webhook_service";

const router = Router();

export default router;

router.post('/', (req, res, next) => {
  const request: WebhookRequest = {
    enabled: req.body.enabled,
    eventName: req.body.eventName,
    merchantId: req.body.merchantId,
    url: req.body.url
  }
  saveWebhook(request)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error adding webhook: %s, err: %s", request, err)
    next(err)
  })
})

router.patch('/:id', (req, res, next) => {
  const request: WebhookRequest = {
    enabled: req.body.enabled,
    eventName: req.body.eventName,
    merchantId: req.body.merchantId,
    url: req.body.url
  }
  updateWebhook(req.params.id, request)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error updating webhook: %s, err: %s", req.body, err)
    next(err)
  })
})

router.get('/merchant/:id', (req, res, next) => {
  getWebhooksByMerchantId(req.params.id)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error getting webhook by merchantId: %s, err: %s", req.body, err)
    next(err)
  })
})