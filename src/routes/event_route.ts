import {Router} from 'express'

import {EventRequest} from "../model/inbound/event_request";
import {logger} from "../configuration/Logging";
import {getAllEvents, getEventById, saveEvent, updateEvent} from "../service/event_service";
import {body, validationResult, param} from 'express-validator';

const router = Router();

export default router;

router.post('/',
    body('name').isLength({min: 1}),
    body('enabled').isBoolean()
    , ((req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const request: EventRequest = {name: req.body.name, enabled: req.body.enabled}
      saveEvent(request)
      .then(eventResponse => {
        res.status(200);
        res.json(eventResponse);
        next();
      })
      .catch(err => {
        logger.error("Error adding event: %s, err: %s", request, err)
        next(err)
      });
    }))
router.patch('/:id',
    body('name').isLength({min: 1}),
    body('enabled').isBoolean());

router.patch('/:id',
    ((req, res, next) => {


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const request: EventRequest = {name: req.body.name, enabled: req.body.enabled}
      updateEvent(req.params.id, request)
      .then(eventResponse => {
        res.status(200);
        res.json(eventResponse);
        next();
      }).catch(err => {
        logger.error("Error updating event: %s, id: %s, err: %s", request, req.params.id, err)
        next(err)
      });
    }))

router.get('/', ((req, res, next) => {
  getAllEvents()
  .then(eventResponse => {
    res.status(200);
    res.json(eventResponse);
    next();
  }).catch(err => {
    logger.error("Error getting event, id: %s, err: %s", req.params.id, err)
    next(err)
  });
}))

router.get('/:id', ((req, res, next) => {

  getEventById(req.params.id)
  .then(eventResponse => {
    res.status(200);
    res.json(eventResponse);
    next();
  }).catch(err => {
    logger.error("Error updating event: %s, id: %s, err: %s", req.body, req.params.id, err)
    next(err)
  });
}))