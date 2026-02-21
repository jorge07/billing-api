import { Domain, EventSourcing } from "hollywood-js";
import { inject, injectable } from "inversify";
import {Histogram} from "prom-client";
import { Repository, SelectQueryBuilder } from "typeorm";
import Probe from "../Audit/Probe";
import { Events } from "./Mapping/Events";

@injectable()
export default class PostgresEventStoreDBAL implements EventSourcing.IEventStoreDBAL {

    private write: Histogram<string>;
    private read: Histogram<string>;

    constructor(
        @inject("infrastructure.eventStore.postgresRepository") private readonly repository: Repository<Events>,
    ) {
        this.write = Probe.histogram({
            buckets: [0.001, 0.003, 0.01, 0.03],
            help: "Write duration in Write Model",
            labelNames: [],
            name: "event_store_postgres_write_duration_seconds",
        });
        this.read = Probe.histogram({
            buckets: [0.001, 0.003, 0.01, 0.03],
            help: "Read duration in Write Model",
            labelNames: [],
            name: "event_store_postgres_read_duration_seconds",
        });
    }

    public async load(aggregateId: string, from?: number): Promise<Domain.DomainEventStream> {
        return await this.loadFromTo(aggregateId, from);
    }

    public async loadFromTo(aggregateId: string, from?: number, to?: number): Promise<Domain.DomainEventStream> {
        let stream: Domain.DomainEventStream;
        const end = this.read.startTimer();

        try {
            const rows = await this.getManyQuery(aggregateId, from, to).getMany();
            stream = new Domain.DomainEventStream(rows.map(this.rowToDomainMessage));
        } catch (err) {
            throw new Error("Cant retrieve events: " + (err as Error).message);
        } finally {
            end();
        }

        return stream;
    }

    public async append(
        aggregateId: string,
        stream: Domain.DomainEventStream,
        expectedVersion?: number,
    ): Promise<void> {
        const end = this.write.startTimer();
        try {
            await this.repository.save(
                stream.events.map((message) => Events.fromDomainMessage(message)),
                { transaction: true },
            );
        } catch (err) {
            throw new Error("Cant store events: " + (err as Error).message);
        } finally {
            end();
        }
    }

    public async *loadAll(fromPosition: number = 0): AsyncIterable<Domain.DomainMessage> {
        const rows = await this.repository
            .createQueryBuilder("events")
            .where("events.playhead >= :playhead", { playhead: fromPosition })
            .orderBy("events.occurred", "ASC")
            .addOrderBy("events.playhead", "ASC")
            .getMany();

        for (const row of rows) {
            yield this.rowToDomainMessage(row);
        }
    }

    private rowToDomainMessage(row: Events): Domain.DomainMessage {
        // Ensure stored event satisfies the DomainEvent interface
        const event: Domain.DomainEvent = {
            aggregateId: row.uuid,
            occurredAt: row.occurred,
            ...(row.event as object),
        };

        return Domain.DomainMessage.create(
            row.uuid,
            row.playhead,
            event,
            Array.isArray(row.metadata) ? row.metadata : [],
            row.occurred,
        );
    }

    private getManyQuery(aggregateId: string, from?: number, to?: number): SelectQueryBuilder<Events> {
        const query = this.repository
            .createQueryBuilder("events")
            .where("events.uuid = :uuid", { uuid: aggregateId })
            .orderBy("playhead")
        ;

        if (from) {
            query.andWhere("events.playhead >= :playhead", { playhead: from });
        }

        if (to) {
            query.andWhere("events.playhead <= :playhead", { playhead: to });
        }

        return query;
    }
}
