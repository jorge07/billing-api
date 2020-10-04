import Price from "domain/transaction/valueObject/price";
import TransactionID from "domain/transaction/valueObject/transactionId";
import type { ICommand } from "hollywood-js/src/Application";

export default class CreateCommand implements ICommand {
    public readonly price: Price;
    public readonly uuid: TransactionID;

    constructor(
        uuid: string,
        public readonly product: string,
        price: { amount: number, currency: string },
    ) {
        this.uuid = new TransactionID(uuid);
        this.price = new Price(price.amount, price.currency);
    }
}
