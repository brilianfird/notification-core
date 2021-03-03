import {EventRequest} from "../model/inbound/event_request";
import {EventResponse} from "../model/outbound/event_response";
import {
  getAllEventEntities, getEventEntity, getEventEntityByName,
  saveEventEntity,
  updateEventEntity
} from "../repository/event_repository";

export async function saveEvent(request: EventRequest) {
  return saveEventEntity(request)
  .then(obj => {
    if (obj == null) {
      return null;
    }
    const response: EventResponse = {_id: obj._id, name: obj.name, enabled: obj.enabled};
    return response;
  });
}

export async function updateEvent(id: string,request: EventRequest) {
  return updateEventEntity(id, request)
  .then(obj => {
    const response: EventResponse = {_id: id, name: obj.name, enabled: obj.enabled};
    return response;
  });
}

export async function getAllEvents() {
  return getAllEventEntities();
}

export async function getEventById(id: string) {
  return getEventEntity(id);
}

export async function getEventByName(name: string) {
  return getEventEntityByName(name);
}