import { Domain } from "hollywood-js";
import TransactionWasCreated from "./Events/TransactionWasCreated";
import Price from "./ValueObject/Price";
import type TransactionId from "./ValueObject/TransactionId";

export default class Transaction extends Domain.EventSourcedAggregateRoot {

    public static create(uuid: TransactionId, product: string, price: Price): Transaction {
        const instance = new Transaction(uuid.toIdentity());

        instance.raise(new TransactionWasCreated(
            uuid.toString(),
            product,
            price.amount,
            price.currency,
        ));

        return instance;
    }

    private price?: Price;
    private product: string = "";

    constructor(uuid: Domain.Identity) {
        super(uuid);
        this.registerHandler(TransactionWasCreated, (event) => this.onTransactionWasCreated(event));
    }

    private onTransactionWasCreated(event: TransactionWasCreated): void {
        this.product = event.product;
        this.price = new Price(event.amount, event.currency);
    }

    get pricing(): Price {
        return this.price!;
    }

    get productName(): string {
        return this.product;
    }
}
