import type { Domain } from "hollywood-js";
import type Price from "../ValueObject/Price";

export default class TransactionWasCreated implements Domain.DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly aggregateId: string,
        public readonly product: string,
        public readonly price: Price,
        occurredAt?: Date,
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
