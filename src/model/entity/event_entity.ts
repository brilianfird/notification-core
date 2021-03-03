import {Model, model, Schema, Document} from "mongoose";

const eventSchema = new Schema<EventDocument, EventModel>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

export interface Event {
  name: string,
  enabled: boolean
}

interface EventDocument extends Event, Document {
  name: string,
  enabled: boolean
}

export interface EventModel extends Model<EventDocument> {

}

export default model<EventDocument, EventModel>("Event", eventSchema)