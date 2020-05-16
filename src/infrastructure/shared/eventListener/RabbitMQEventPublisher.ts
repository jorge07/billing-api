import { Domain, EventStore } from "hollywood-js";
import Probe from "infrastructure/shared/audit/probe";
import AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import { inject } from "inversify";
import type { Counter } from "prom-client";

export default class RabbitMQEventPublisher extends EventStore.EventListener {

    private published: Counter<string>;

    constructor(
        @inject("infrastructure.rabbitmq.connection") private readonly channel: AMPQChannel,
        private readonly context: string = "master",
    ) {
        super();
        this.published =  Probe.counter({
            help: "Counter of events published",
            labelNames: [
                "eventType",
            ],
            name: "event_published_count",
        });
    }

    public on(message: Domain.DomainMessage): void {
        this.channel.publish("events", this.routingKey(message), JSON.stringify(message));
        this.published.inc({ eventType: message.eventType});
    }

    private routingKey(message: Domain.DomainMessage): string {

        return this.context + "." + message.eventType;
    }
}
