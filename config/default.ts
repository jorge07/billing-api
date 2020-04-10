import * as writeModel from "./packages/orm/writeModel/config"
import * as readModel from "./packages/orm/readModel/config"
import rabbitmq from "./packages/rabbitmq/config"

export default {
    env: process.env.NODE_ENV || 'development',
    appName: 'billing-api',
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info'
    },
    rabbitmq: rabbitmq,
    orm: {
        writeModel,
        readModel
    },
    eventStore: {
        margin: 10,
    },
    metrics: {
        
    },
    http: {
        port: process.env.PORT || 8080
    }
}
