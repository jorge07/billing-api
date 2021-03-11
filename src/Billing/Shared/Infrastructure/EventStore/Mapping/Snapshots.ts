import { Domain } from "hollywood-js";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Snapshots {

    public static fromAggregateRoot(aggregateRoot: Domain.AggregateRoot): Snapshots {
        const instance = new Snapshots();

        instance.uuid = instance.uuid;
        instance.aggregateRoot = aggregateRoot;

        return instance;
    }

    @PrimaryColumn("uuid")
    public uuid: string;

    @Column("jsonb")
    public aggregateRoot: Domain.AggregateRoot;
}
