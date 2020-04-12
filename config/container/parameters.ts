import * as config from 'config';
import type { Framework } from 'hollywood-js';

export const parameters: Framework.ParametersList = new Map([
    [
        "appName", 
        config.get('appName')
    ],
    [
        "logLevel",
        config.get('logger.logLevel')
    ],
    [
        "orm.writeModel",
        config.get('orm.writeModel')
    ],
    [
        "orm.readModel",
        config.get('orm.readModel')
    ],
    [
        "rabbitmq",
        config.get('rabbitmq')
    ],
    [
        "env",
        config.get('env')
    ],
    [
        "port", 
        config.get('http.port')
    ],
    [
        "eventStore.margin", 
        config.get('eventStore.margin')
    ],
    [
        "metricsConfig", 
        config.get('metrics')
    ],
]);
