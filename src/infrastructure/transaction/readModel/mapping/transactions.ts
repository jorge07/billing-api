import { DomainMessage } from "hollywood-js/src/Domain";
import {Column, Entity, PrimaryColumn } from "typeorm";
import TransactionWasCreated from "../../../../domain/transaction/events/transactionWasCreated";
import Transaction from "../../../../domain/transaction/transaction";

@Entity()
export class Transactions {

    public static fromCreated(event: TransactionWasCreated): Transactions {

        const instance = new Transactions();

        instance.uuid = event.uuid;
        instance.product = event.product;
        instance.priceAmount = event.price.amount;
        instance.priceCurrency = event.price.currency;
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
