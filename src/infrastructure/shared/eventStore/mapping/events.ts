import { DomainMessage } from "hollywood-js/src/Domain";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Events {

    public static fromDomainMessage(message: DomainMessage): Events {
        const event = new Events();

        event.uuid = message.uuid;
        event.playhead = message.playhead;
        event.event = message.event;
        event.metadata = message.metadata;
        event.ocurredOn = message.ocurredOn;
        event.eventType = message.eventType;

        return event;
    }

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column("uuid")
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
    public ocurredOn: Date;

    @Column("varchar")
    public eventType: string;
}
