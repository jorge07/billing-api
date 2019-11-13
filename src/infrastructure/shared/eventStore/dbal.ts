import { Domain, EventStore } from "hollywood-js";
import { inject, injectable } from "inversify";
import { Events } from './mapping/events';
import { Repository, SelectQueryBuilder } from "typeorm";

@injectable()
export default class PostgresEventStoreDBAL implements EventStore.IEventStoreDBAL {

    constructor(
        @inject("infrastructure.eventStore.postgresConnection") private readonly repository: Repository<Events>,
    ) { }

    public async load(aggregateId: string, from?: number): Promise<Domain.DomainEventStream> {
        return await this.loadFromTo(aggregateId, from);
    }

    public async loadFromTo(aggregateId: string, from?: number, to?: number): Promise<Domain.DomainEventStream> {
        return new Domain.DomainEventStream(
            await this.getManyQuery(aggregateId, from, to).getMany()
        );
    }
 
    public async append(aggregateId: string, stream: Domain.DomainEventStream): Promise<void> {
        try {
            await this.repository.save(
                stream.events.map((message) => (Events.fromDomainMessage(message))), 
                {
                    transaction: true,
                }
            );
         } catch (err) {
             throw new Error("Cant store events: " + err.message);
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
