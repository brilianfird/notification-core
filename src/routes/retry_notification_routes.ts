import {Router} from "express";
import {logger} from "../configuration/Logging";
import {runRetryNotifications} from "../service/retry_notification_service";

const router = Router();

export default router;

router.post('/run', (req, res, next) => {
  runRetryNotifications()
  .then(success => {
    res.status(200);
    res.json({"success": success})
    next()
  }).catch(err => {
    logger.error("Error running retry notifications , err: %s", req.params.id, err);
    next(err);
  })
})