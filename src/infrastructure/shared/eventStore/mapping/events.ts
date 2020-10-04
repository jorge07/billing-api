import type { DomainMessage } from "hollywood-js/src/Domain";
import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Events {

    public static fromDomainMessage(message: DomainMessage): Events {
        const event = new Events();

        event.uuid = message.uuid;
        event.playhead = message.playhead;
        event.event = message.event;
        event.metadata = message.metadata;
        event.occurred = message.occurred;
        event.eventType = message.eventType;

        return event;
    }

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Index({ unique: true })
    @Column({ unique: true })
    public uuid: string;

    @Column({
        default: 0,
        nullable: true,
    })
    public playhead: number;

    @Column("jsonb")
    public event: any;

    @Column("jsonb")
    public metadata: any;

    @Column("timestamptz")
    public occurred: Date;

    @Column("varchar")
    public eventType: string;
}
