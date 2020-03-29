import { Channel } from "amqplib";
import { Domain, EventStore } from "hollywood-js";
import { inject } from "inversify";

export default class RabbitMQEventPublisher extends EventStore.EventListener {

    constructor(
        @inject("infrastructure.rabbitmq.connection") private readonly channel: Channel,
        private readonly context: string = "master",
    ) {
        super();
    }

    public on(message: Domain.DomainMessage): void {
        this.channel.publish("events", this.routingKey(message), Buffer.from(JSON.stringify(message), "utf8"));
    }

    private routingKey(message: Domain.DomainMessage): string {

        return this.context + "." + message.eventType;
    }
}
