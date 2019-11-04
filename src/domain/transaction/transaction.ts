import { Domain } from "hollywood-js";
import TransactionWasCreated from "./events/transactionWasCreated";
import { TransactionID } from "./transactionId";

export default class Transaction extends Domain.EventSourced {

    public static create(uuid: TransactionID, product: string, price: string): Transaction {
        const instance = new Transaction(uuid);

        instance.raise(new TransactionWasCreated(
            uuid,
            product,
            price,
        ));

        return instance;
    }

    protected price?: string;
    protected product?: string;

    constructor(uuid: TransactionID) {
        super(uuid);
    }

    protected applyTransactionWasCreated(event: TransactionWasCreated) {
        this.product = event.product;
        this.price = event.price;
    }
}
