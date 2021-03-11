import { Domain, EventSourcing } from "hollywood-js";
import { inject } from "inversify";
import type { Counter } from "prom-client";
import Probe from "../Audit/Probe";
import AMPQChannel from "../Rabbitmq/Channel";

export default class RabbitMQEventPublisher extends EventSourcing.EventListener {

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
