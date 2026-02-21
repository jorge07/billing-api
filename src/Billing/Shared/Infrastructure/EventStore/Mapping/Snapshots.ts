import { Domain } from "hollywood-js";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Snapshots {

    public static fromAggregateRoot(aggregateRoot: Domain.EventSourcedAggregateRoot): Snapshots {
        const instance = new Snapshots();

        instance.uuid = aggregateRoot.getAggregateRootId().toString();
        instance.aggregateRoot = aggregateRoot;

        return instance;
    }

    @PrimaryColumn("uuid")
    public uuid: string;

    @Column("jsonb")
    public aggregateRoot: Domain.EventSourcedAggregateRoot;
}
