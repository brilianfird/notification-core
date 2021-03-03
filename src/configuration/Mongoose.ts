import mongoose from 'mongoose'
import {serverProperties} from "./Properties";

export const connectMongoose = () => mongoose.connect(String(serverProperties.get("mongo.uri")))