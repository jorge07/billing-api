import { Domain } from "hollywood-js";
import type {AggregateRootId} from "hollywood-js/src/Domain/AggregateRoot";
import TransactionWasCreated from "./Events/TransactionWasCreated";
import type Price from "./ValueObject/Price";
import type TransactionId from "./ValueObject/TransactionId";

export default class Transaction extends Domain.EventSourcedAggregateRoot {

    public static create(uuid: TransactionId, product: string, price: Price): Transaction {
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

    constructor(uuid: AggregateRootId) {
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
