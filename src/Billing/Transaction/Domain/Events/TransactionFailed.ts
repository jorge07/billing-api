import type { Domain } from "hollywood-js";

export default class TransactionFailed implements Domain.DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly aggregateId: string,
        public readonly reason: string,
        occurredAt?: Date,
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
