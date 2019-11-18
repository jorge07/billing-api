import * as writeModel from "./packages/orm/writeModel/config"
import * as readModel from "./packages/orm/readModel/config"

export default {
    env: process.env.NODE_ENV || 'development',
    appName: 'billing-api',
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info'
    },
    orm: {
        writeModel,
        readModel
    },
    eventStore: {
        margin: 10,
    },
    http: {
        port: process.env.PORT || 3000
    }
}
