import { Channel, Message, Connection } from 'amqplib';
import { injectable } from 'inversify';
import { ILog } from 'infrastructure/shared/audit/logger';

@injectable()
export default class AMPQChannel {

    private readonly defaultExange: string = 'events';

    constructor(
        private readonly connection: Connection,
        private readonly channel: Channel
    ) {}

    async publish(exchange: string = 'events', routingKey: string = 'domain', message: string): Promise<boolean | void> {
        try {
            return this.channel.publish(exchange, routingKey, Buffer.from(message));
        } catch(err) {
            throw new Error('Publish message error: ' + err.message);
        }
    }

    async consume(exchange: string = 'events', queue: string = 'events', action: (mgs: Message | null) => any) {
        await this.channel.assertQueue(queue, { exclusive: false });
        await this.channel.bindQueue(queue, exchange, queue);
        await this.channel.consume(queue, action, { noAck: true });
    }

    public async close(): Promise<void> {
        await this.channel.close();
        await this.connection.close();
    }
}
