import { connect, Channel, Connection } from "amqplib";
import { injectable, inject } from 'inversify';

@injectable()
export default class RabbitMQChannelClientFactory {

    constructor(
        @inject('rabbitmq') private readonly config: any
    ) {}

    public async createChannel(): Promise<{channel: Channel, connection: Connection}> {
        const openConnection: Connection = await connect(this.config);

        process.once('SIGINT', openConnection.close.bind(openConnection));

        const channel = await openConnection.createConfirmChannel()
        await channel.assertExchange(this.config.defaultExchange, 'topic', this.config.defaultOptions || {});

        return { channel, connection: openConnection };
    }
}
