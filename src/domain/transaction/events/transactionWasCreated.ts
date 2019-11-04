import { Domain } from "hollywood-js";
import { TransactionID } from "../transactionId";

export default class TransactionWasCreated extends Domain.DomainEvent {
    constructor(
        public readonly uuid: TransactionID,
        public readonly product: string,
        public readonly price: string,
    ) {
        super();
    }
}
