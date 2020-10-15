export default {
    protocol: "amqp",
    hostname: process.env.RMQ_HOST || "127.0.0.1",
    port: 5672,
    username: process.env.RMQ_USER || "guest",
    password: process.env.RMQ_PASS || "guest",
    locale: "en_US",
    frameMax: 0,
    heartbeat: 0,
    vhost: "/",
    defaultExchange: "events",
    defaultOptions: {},
};
