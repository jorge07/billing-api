import { Message } from "amqplib";
import { Domain } from "hollywood-js";
import { EventStore } from "hollywood-js";
import { ILog } from "infrastructure/shared/audit/logger";
import AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import KernelFactory, { Kernel } from "../../../kernel";

const MAX_MESSAGES_BEFORE_RESTART = 100;

(async () => {
    let counter: number  = 0;
    const kernel: Kernel = await KernelFactory(false);

    const amqpChannel = kernel.container.get<AMPQChannel>("infrastructure.transaction.rabbitmq.connection");
    const eventBus = kernel.container.get<EventStore.EventBus>("infrastructure.transaction.async.eventBus");
    const logger = kernel.container.get<ILog>("logger");

    try {
        await amqpChannel.consume("events", "#", async (message: Message) => {
            const domainMessage = (JSON.parse(message.content.toString()) as Domain.DomainMessage);
            await eventBus.publish(domainMessage);
            counter++;

            if (counter >= MAX_MESSAGES_BEFORE_RESTART) {
                await amqpChannel.close();
            }

            return true;
        });
    } catch (error) {
        logger.error(error.message);
    }
})();
