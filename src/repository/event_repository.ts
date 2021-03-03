import EventModel, { Event } from '../model/entity/event_entity'
import {EventRequest} from "../model/inbound/event_request";
import BusinessException from "../model/BusinessException";
import {EventResponse} from "../model/outbound/event_response";
import {logger} from "../configuration/Logging";

export async function saveEventEntity(request: EventRequest) {
  return new Promise<boolean>((resolve, reject) => {
    EventModel.findOne({name: request.name}, null, null, (err, doc) => {
      if (doc == null) {
        resolve(true)
      } else {
        reject(new BusinessException("Document with same name already exist", 400));
      }
    })
  }).then(() => {
      return new Promise<Event>(resolve => {
        const event: Event = {name: request.name, enabled: request.enabled}
        resolve(event);
      })
      .then(eventEntity => EventModel.create(eventEntity))
      .then(eventEntity => eventEntity.toObject());
  });
}

export async function updateEventEntity(id: string, request: EventRequest) {
  return new Promise<Event>((resolve, reject) => {
    EventModel.findOne({_id: id}, null, null, (err, doc) => {
      if (doc != null) {
        doc.name = request.name;
        doc.enabled = request.enabled;
        doc.save().then(res => resolve(res));
      } else {
        reject(new BusinessException("Document doesn't exist", 400));
      }
    })
  });
}

export async function getAllEventEntities() {
  return new Promise<Array<EventResponse>>(resolve => {

    let events: Array<EventResponse> = new Array<EventResponse>();
    EventModel.find({}, (err, docs) => {
      docs.forEach((value) => {
        events.push({_id: value._id, name: value.name, enabled:value.enabled});
      })
      resolve(events);
    })
  })
}

export async function getEventEntity(id: string) {
  return new Promise<EventResponse>((resolve, reject) => {
    EventModel.findOne({"_id": id}, null, null, (err, doc) => {
      if (err != null) {
        reject(err)
      }
      if (doc == null) {
        return null;
      }
      resolve({_id: doc._id, name: doc.name, enabled: doc.enabled})
    })
  }).catch(err => {
    logger.error("Error getting event for id %s", id, err);
    return {};
  });
}

export async function getEventEntityByName(name: string) {
  return new Promise<EventResponse>((resolve, reject) => {
    EventModel.findOne({"name": name}, null, null, (err, doc) => {
      if (err != null) {
        reject(err)
      }
      if (doc == null) {
        return null;
      }
      resolve({_id: doc._id, name: doc.name, enabled: doc.enabled})
    })
  });
}

