import Monitor from "@Apps/HTTP/Monitor";
import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import Probe from "@Shared/Infrastructure/Audit/Probe";
import type AMPQChannel from "@Shared/Infrastructure/Rabbitmq/Channel";
import type { Message } from "amqplib";
import type { Domain, EventSourcing, Framework } from "hollywood-js";
import type {Histogram} from "prom-client";

const MAX_MESSAGES_BEFORE_RESTART = 100;

export default class AsyncEventBus {
    private readonly histogram: Histogram<string>;
    private readonly amqpChannel: AMPQChannel;
    private readonly eventBus: EventSourcing.EventBus;
    private readonly logger: ILog;

    constructor(
        private readonly kernel: Framework.Kernel,
        private readonly queue: string,
        private readonly pattern: string,
        private readonly maxMessages: number = MAX_MESSAGES_BEFORE_RESTART,
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
        this.amqpChannel = kernel.container.get<AMPQChannel>("infrastructure.rabbitmq.connection");
        this.eventBus = kernel.container.get<EventSourcing.EventBus>("infrastructure.transaction.async.eventBus");
        this.logger = kernel.container.get<ILog>("logger");
    }

    public async consume() {
        let counter: number  = 0;
        // Start server to report metrics in monitor port
        if (this.monitor) {
            await (new Monitor(this.kernel.container.get("metrics.port"), this.logger)).up();
        }
        await this.stopWatch(this.amqpChannel, this.logger);

        try {
            this.logger.info(`Waiting for a message in ${this.queue} for topic ${this.pattern}...`);
            await this.amqpChannel.consume("events", this.queue, this.pattern, async (message: Message | null) => {
                try {
                    const domainMessage = (JSON.parse(message.content.toString()) as Domain.DomainMessage);
                    const timer = this.histogram.startTimer({
                        event: domainMessage.eventType,
                        queue: "events",
                    });

                    this.logger.info(`Received: ${domainMessage.uuid} ${domainMessage.eventType}`);
                    await this.eventBus.publish(domainMessage);
                    this.logger.info(`Processed: ${domainMessage.uuid} ${domainMessage.eventType}`);
                    counter++;

                    timer();
                    await this.limit(counter, this.amqpChannel, this.logger);
                    return true;

                } catch (error) {
                    this.logger.error(error.message);
                    return false;
                }
            });
        } catch (error) {
            this.logger.error(error.message);
            process.exit(1);
        }
    }

    private async limit(counter: number, amqpChannel: AMPQChannel, logger: ILog) {
        const STOP_MARGIN = 10000;
        if (counter >= this.maxMessages) {
            await amqpChannel.close();
            logger.warn(`Max messages processed (${this.maxMessages}). Channel closed. Shutting down in 10 seconds.`);
            setTimeout(() => {
                logger.warn(`Shut down.`);
                process.exit(0);
            }, STOP_MARGIN);
        }
    }

    private async stopWatch(amqpChannel: AMPQChannel, logger: ILog): Promise<void> {
        const signals = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        signals.forEach((sig: any) => {
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
