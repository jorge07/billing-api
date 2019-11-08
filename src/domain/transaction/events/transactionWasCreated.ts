import { Domain } from "hollywood-js";
import { TransactionID } from "../transactionId";
import Price from "../valueObject/price";

export default class TransactionWasCreated extends Domain.DomainEvent {
    constructor(
        public readonly uuid: TransactionID,
        public readonly product: string,
        public readonly price: Price,
    ) {
        super();
    }
}
