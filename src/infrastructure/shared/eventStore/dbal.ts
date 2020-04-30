import { Domain, EventStore } from "hollywood-js";
import Probe from "infrastructure/shared/audit/probe";
import { inject, injectable } from "inversify";
import {Histogram} from "prom-client";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Events } from "./mapping/events";

@injectable()
export default class PostgresEventStoreDBAL implements EventStore.IEventStoreDBAL {

    private write: Histogram<string>;
    private read: Histogram<string>;

    constructor(
        @inject("infrastructure.eventStore.postgresRepository") private readonly repository: Repository<Events>,
    ) {
        this.write = Probe.histogram({
            buckets: [0.01, 0.03, 0.1, 0.3],
            help: "Write duration in Write Model",
            labelNames: [],
            name: "event_store_postgres_write_duration_seconds",
        });
        this.read = Probe.histogram({
            buckets: [0.01, 0.03, 0.1, 0.3],
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
            stream = new Domain.DomainEventStream(
                await this.getManyQuery(aggregateId, from, to).getMany(),
            );
        } catch (err) {
            throw new Error("Cant retrieve events: " + err.message);
        } finally {
            end();
        }

        return stream;
    }

    public async append(aggregateId: string, stream: Domain.DomainEventStream): Promise<void> {
        const end = this.write.startTimer();
        try {
            await this.repository.save(
                stream.events.map((message) => (Events.fromDomainMessage(message))),
                {
                    transaction: true,
                },
            );
         } catch (err) {
             throw new Error("Cant store events: " + err.message);
         } finally {
            end();
        }
    }

    private getManyQuery(aggregateId: Domain.AggregateRootId, from?: number, to?: number): SelectQueryBuilder<Events> {
        const query = this.repository
            .createQueryBuilder("events")
            .where("events.uuid = :uuid",  {
                uuid: aggregateId,
            })
            .orderBy("playhead")
        ;

        if (from) {
            query.andWhere("events.playhead >= :playhead",  { playhead: from });
        }

        if (to) {
            query.andWhere("events.playhead <= :playhead", { playhead: to });
        }

        return query;
    }
}
