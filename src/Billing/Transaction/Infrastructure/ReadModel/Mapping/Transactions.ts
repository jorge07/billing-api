import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Transactions {

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
