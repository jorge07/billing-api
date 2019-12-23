import { Domain } from "hollywood-js";
import Price from "../valueObject/price";
import TransactionID from "../valueObject/transactionId";

export default class TransactionWasCreated extends Domain.DomainEvent {
    constructor(
        public readonly uuid: TransactionID,
        public readonly product: string,
        public readonly price: Price,
    ) {
        super();
    }
}
