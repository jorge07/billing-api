import { Domain } from "hollywood-js";
import { AggregateRootId } from "hollywood-js/src/Domain";
import TransactionWasCreated from "./events/transactionWasCreated";
import Price from "./valueObject/price";
import TransactionID from "./valueObject/transactionId";

export default class Transaction extends Domain.EventSourced {

    public static create(uuid: TransactionID, product: string, price: Price): Transaction {
        const instance = new Transaction(uuid.toString());

        instance.raise(new TransactionWasCreated(
            uuid,
            product,
            price,
        ));

        return instance;
    }

    private price?: Price;
    private product?: string;

    constructor(uuid: AggregateRootId) {
        super(uuid);
    }

    protected applyTransactionWasCreated(event: TransactionWasCreated) {
        this.product = event.product;
        this.price = event.price;
    }
}
