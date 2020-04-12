import { Channel, Connection, Message } from "amqplib";
import { injectable } from "inversify";

@injectable()
export default class AMPQChannel {

    constructor(
        private readonly connection: Connection,
        private readonly channel: Channel,
    ) {}

    public publish(
        exchange: string = "events",
        routingKey: string = "domain",
        message: string,
    ): boolean {
        try {
            return this.channel.publish(exchange, routingKey, Buffer.from(message));
        } catch (err) {
            throw new Error("Publish message error: " + err.message);
        }
    }

    public async consume(exchange: string = "events", queue: string = "events", action: (mgs: Message | null) => any) {
        await this.channel.assertQueue(queue, { exclusive: false });
        await this.channel.bindQueue(queue, exchange, queue);
        await this.channel.consume(queue, action, { noAck: true });
    }

    public async close(): Promise<void> {
        await this.channel.close();
        await this.connection.close();
    }
}
