import {Router} from "express";
import {VerificationTokenRequest} from "../model/inbound/verification_token_request";
import {
  getVerificationTokenByMerchantId,
  saveVerificationToken,
  updateVerificationToken
} from "../service/verification_token_service";
import {logger} from "../configuration/Logging";

const router = Router();

export default router;

router.post('/', (req, res, next) => {
  const request: VerificationTokenRequest = {merchantId: req.body.merchantId, token: req.body.token}
  saveVerificationToken(request)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error adding verification token: %s, err: %s", request, err)
    next(err)
  })
})

router.patch('/:id', (req, res, next) => {
  const request: VerificationTokenRequest = {merchantId: req.body.merchantId, token: req.body.token}
  updateVerificationToken(req.params.id, request)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error adding verification token: %s, err: %s", req.body, err)
    next(err)
  })
})

router.get('/merchant/:id', (req, res, next) => {
  getVerificationTokenByMerchantId(req.params.id)
  .then(response => {
    res.status(200).json(response);
    next()
  }).catch(err => {
    logger.error("Error adding verification token: %s, err: %s", req.body, err)
    next(err)
  })
})