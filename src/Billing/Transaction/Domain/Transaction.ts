import { Domain } from "hollywood-js";
import TransactionWasCreated from "./Events/TransactionWasCreated";
import type Price from "./ValueObject/Price";
import type TransactionId from "./ValueObject/TransactionId";

export default class Transaction extends Domain.EventSourcedAggregateRoot {

    public static create(uuid: TransactionId, product: string, price: Price): Transaction {
        const instance = new Transaction(uuid.toIdentity());

        instance.raise(new TransactionWasCreated(
            uuid.toString(),
            product,
            price,
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
        this.price = event.price;
    }

    get pricing(): Price {
        return this.price!;
    }

    get productName(): string {
        return this.product;
    }
}
