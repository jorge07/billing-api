import { EventStore, Domain } from "hollywood-js";
import { Channel } from 'amqplib';
import { inject } from 'inversify';

export default class RabbitMQEventPublisher extends EventStore.EventListener {
    
    public on(message: Domain.DomainMessage): void {
        this.channel.publish('default', this.routingKey(message), Buffer.from(JSON.stringify(message), "utf8"));
    }

    private routingKey(message: Domain.DomainMessage): string {
        
        return this.context + '.' + message.eventType;
        
    }

    constructor(
        @inject('infrastructure.rabbitmq.connection') private readonly channel: Channel,
        private readonly context: string
    ) {
        super();
    }
}
