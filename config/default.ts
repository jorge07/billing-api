export = {
    env: process.env.NODE_ENV || 'development',
    appName: 'billing-api',
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info'
    },
    eventStore: {
        margin: 10,
    },
    http: {
        port: process.env.PORT || 3000
    }
}
