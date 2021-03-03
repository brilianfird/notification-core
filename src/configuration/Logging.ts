import winston, {format} from 'winston'
import 'winston-mongodb'
import {serverProperties} from "./Properties";

export const logger = winston.createLogger({
  format: format.combine(
      format.splat(),
      format.simple()
  ),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.MongoDB({db: String(serverProperties.get('mongo.uri'))}),
    new winston.transports.Console()
  ],
});