import type { ICommand } from "hollywood-js/src/Application";
import Price from "../../Domain/ValueObject/Price";
import TransactionId from "../../Domain/ValueObject/TransactionId";

export default class CreateCommand implements ICommand {
    public readonly price: Price;
    public readonly uuid: TransactionId;

    constructor(
        uuid: string,
        public readonly product: string,
        price: { amount: number, currency: string },
    ) {
        this.uuid = new TransactionId(uuid);
        this.price = new Price(price.amount, price.currency);
    }
}
