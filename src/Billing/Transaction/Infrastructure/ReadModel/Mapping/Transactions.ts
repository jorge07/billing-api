import type TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Transactions {

    public static fromCreated(event: TransactionWasCreated): Transactions {

        const instance = new Transactions();

        instance.uuid = event.aggregateId;
        instance.product = event.product;
        instance.priceAmount = event.amount;
        instance.priceCurrency = event.currency;
        instance.createdAt = new Date();

        return instance;
    }

    @PrimaryColumn("uuid")
    public uuid: string;

    @Column("timestamptz")
    public createdAt: Date;

    @Column("varchar")
    public product: string;

    @Column("float", { name: "price.amount"})
    public priceAmount: number;

    @Column("varchar", { name: "price.currency"})
    public priceCurrency: string;
}
