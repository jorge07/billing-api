import type { Message } from 'amqplib';
import type { Domain, EventStore, Framework } from "hollywood-js";
import type { ILog } from "infrastructure/shared/audit/logger";
import type AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import KernelFactory from "../../../kernel";
import type Probe from 'infrastructure/shared/audit/probe';
import HTTPServer from '../../http/server';

const MAX_MESSAGES_BEFORE_RESTART = 100;

(async () => {
    let counter: number  = 0;
    const kernel: Framework.Kernel = await KernelFactory(false);

    // Start server to report metrics in monitor port
    kernel.container.get<HTTPServer>("ui.httpServer").up();

    const amqpChannel = kernel.container.get<AMPQChannel>("infrastructure.rabbitmq.connection");
    const eventBus = kernel.container.get<EventStore.EventBus>("infrastructure.transaction.async.eventBus");
    const probe = kernel.container.get<Probe>("infrastructure.shared.audit.probe");
    const logger = kernel.container.get<ILog>("logger");

    stopWatch(amqpChannel);

    const labelsNames = [
        'queue',
        'event'
    ];
    const buckets = [0.003, 0.03, 0.1, 0.3, 1.5, 10];
    const histogram = probe.histogram({
        name: 'events_worker_duration_seconds',
        help: 'duration histogram of events processing labeled with: ' + labelsNames.join(', '),
        labelNames: labelsNames,
        buckets: buckets
      });

    try {
        logger.info("Waiting for a message...");
        await amqpChannel.consume("events", "#", async (message: Message) => {
            try {
                const domainMessage = (JSON.parse(message.content.toString()) as Domain.DomainMessage);
                const timer = histogram.startTimer({
                    event: domainMessage.eventType,
                    queue: 'events'
                });
                logger.info(`Received: ${domainMessage.uuid} ${domainMessage.eventType}`);
    
                await eventBus.publish(domainMessage);
                counter++;
                timer();

                if (counter >= MAX_MESSAGES_BEFORE_RESTART) {
                    await amqpChannel.close();
                    logger.warn(`Max messages processed (${MAX_MESSAGES_BEFORE_RESTART}), shutting down.`);
                    process.exit(0);
                }
                logger.info(`Processed: ${domainMessage.uuid} ${domainMessage.eventType}`);
                return true;
    
            } catch(error) {
                logger.error(error.message);
                return false
            }
        });
    } catch (error) {
        logger.error(error.message);
    }
})();

async function stopWatch(amqpChannel: AMPQChannel): Promise<void> {
    const sigs = [
        "SIGINT",
        "SIGTERM",
        "SIGQUIT",
    ];

    sigs.forEach((sig: any) => {
        process.on(sig, async () => {
            this.logger.warn("Shutting down...");
            try {
                await amqpChannel.close();
                process.exit(0);
            } catch (err) {
                this.logger.warn(`Shutting down error: ${err.message}`);
                process.exit(1);
            }
              
        });
    });
}
