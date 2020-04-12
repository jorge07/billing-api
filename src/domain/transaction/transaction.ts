import { Domain } from "hollywood-js";
import TransactionWasCreated from "./events/transactionWasCreated";
import type Price from "./valueObject/price";
import type TransactionID from "./valueObject/transactionId";

export default class Transaction extends Domain.EventSourced {

    public static create(uuid: TransactionID, product: string, price: Price): Transaction {
        const instance = new Transaction(uuid.toString());

        instance.raise(new TransactionWasCreated(
            uuid.toString(),
            product,
            price,
        ));

        return instance;
    }

    private price?: Price;
    private product: string = "";

    constructor(uuid: Domain.AggregateRootId) {
        super(uuid);
    }

    protected applyTransactionWasCreated(event: TransactionWasCreated) {
        this.product = event.product;
        this.price = event.price;
    }

    get pricing(): Price {
        return this.price;
    }

    get productName(): string {
        return this.product;
    }
}
