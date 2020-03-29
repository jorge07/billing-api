import { Message } from "amqplib";
import { Domain, EventStore, Framework } from "hollywood-js";
import { ILog } from "infrastructure/shared/audit/logger";
import AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import KernelFactory from "../../../kernel";

const MAX_MESSAGES_BEFORE_RESTART = 100;

(async () => {
    let counter: number  = 0;
    const kernel: Framework.Kernel = await KernelFactory(false);

    const amqpChannel = kernel.container.get<AMPQChannel>("infrastructure.rabbitmq.connection");
    const eventBus = kernel.container.get<EventStore.EventBus>("infrastructure.transaction.async.eventBus");
    const logger = kernel.container.get<ILog>("logger");

    try {
        logger.info("Waiting for a message...");
        await amqpChannel.consume("events", "#", async (message: Message) => {
            const domainMessage = (JSON.parse(message.content.toString()) as Domain.DomainMessage);
            logger.info(`Received: ${domainMessage.uuid} ${domainMessage.eventType}`);

            await eventBus.publish(domainMessage);
            counter++;

            if (counter >= MAX_MESSAGES_BEFORE_RESTART) {
                await amqpChannel.close();
                logger.warn(`Max messages processed (${MAX_MESSAGES_BEFORE_RESTART}), shutting down.`);
                process.exit(0);
            }
            logger.info(`Processed: ${domainMessage.uuid} ${domainMessage.eventType}`);
            return true;
        });
    } catch (error) {
        logger.error(error.message);
    }
})();
