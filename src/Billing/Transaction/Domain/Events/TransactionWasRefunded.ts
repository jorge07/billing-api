import type { Domain } from "hollywood-js";

export default class TransactionWasRefunded implements Domain.DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly aggregateId: string,
        occurredAt?: Date,
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
