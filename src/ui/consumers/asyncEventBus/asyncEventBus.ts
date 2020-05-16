import type { Message } from "amqplib";
import type { Domain, EventStore, Framework } from "hollywood-js";
import type { ILog } from "infrastructure/shared/audit/logger";
import Probe from "infrastructure/shared/audit/probe";
import type AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import type {Histogram} from "prom-client";
import Monitor from "ui/http/Monitor";
import KernelFactory from "../../../kernel";

const MAX_MESSAGES_BEFORE_RESTART = 100;

export default class AsyncEventBus {
    private readonly histogram: Histogram<string>;

    constructor(
        private readonly queue: string,
        private readonly pattern: string,
        private readonly monitor: boolean = false,
    ) {
        const labelsNames = [
            "queue",
            "event",
        ];
        const buckets = [0.003, 0.03, 0.1, 0.3, 1.5, 10];
        this.histogram = Probe.histogram({
            buckets,
            help: "Duration histogram of events processing labeled with: " + labelsNames.join(", "),
            labelNames: labelsNames,
            name: "events_worker_duration_seconds",
        });
    }

    public async consume() {
        let counter: number  = 0;
        const kernel: Framework.Kernel = await KernelFactory(false);
        // Start server to report metrics in monitor port
        if (this.monitor) {
            await kernel.container.get<Monitor>("ui.monitor").up();
        }
        const amqpChannel = kernel.container.get<AMPQChannel>("infrastructure.rabbitmq.connection");
        const eventBus = kernel.container.get<EventStore.EventBus>("infrastructure.transaction.async.eventBus");
        const logger = kernel.container.get<ILog>("logger");

        await this.stopWatch(amqpChannel, logger);

        try {
            logger.info(`Waiting for a message in ${this.queue} for topic ${this.pattern}...`);
            await amqpChannel.consume("events", this.queue, this.pattern, async (message: Message) => {
                try {
                    const domainMessage = (JSON.parse(message.content.toString()) as Domain.DomainMessage);
                    const timer = this.histogram.startTimer({
                        event: domainMessage.eventType,
                        queue: "events",
                    });

                    logger.info(`Received: ${domainMessage.uuid} ${domainMessage.eventType}`);
                    await eventBus.publish(domainMessage);
                    logger.info(`Processed: ${domainMessage.uuid} ${domainMessage.eventType}`);
                    counter++;

                    timer();
                    await this.limit(counter, amqpChannel, logger);
                    return true;

                } catch (error) {
                    logger.error(error.message);
                    return false;
                }
            });
        } catch (error) {
            logger.error(error.message);
            process.exit(1);
        }
    }

    private async limit(counter: number, amqpChannel: AMPQChannel, logger: ILog) {
        const STOP_MARGIN = 10000;
        if (counter >= MAX_MESSAGES_BEFORE_RESTART) {
            await amqpChannel.close();
            logger.warn(`Max messages processed (${MAX_MESSAGES_BEFORE_RESTART}). Channel closed. Shutting down in 10 seconds.`);
            setTimeout(() => {
                logger.warn(`Shut down.`);
                process.exit(0);
            }, STOP_MARGIN);
        }
    }

    private async stopWatch(amqpChannel: AMPQChannel, logger: ILog): Promise<void> {
        const sigs = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        sigs.forEach((sig: any) => {
            process.on(sig, async () => {
                logger.warn("Shutting down...");
                try {
                    await amqpChannel.close();
                    process.exit(0);
                } catch (err) {
                    logger.warn(`Shutting down error: ${err.message}`);
                    process.exit(1);
                }
            });
        });
    }
}
