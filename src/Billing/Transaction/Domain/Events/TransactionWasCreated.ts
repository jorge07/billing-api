import type { Domain } from "hollywood-js";

/**
 * Raised when a Transaction is created.
 *
 * Carries only primitive data so that the event is safe to serialize, store,
 * and replay without coupling the event schema to the Price value object.
 * To reconstruct a Price, call: new Price(event.amount, event.currency)
 *
 * Source: Young — "Events are the durable record. They must be self-describing
 * with primitive data." CQRS Documents (2010).
 */
export default class TransactionWasCreated implements Domain.DomainEvent {
    public readonly occurredAt: Date;

    constructor(
        public readonly aggregateId: string,
        public readonly product: string,
        public readonly amount: string,
        public readonly currency: string,
        occurredAt?: Date,
    ) {
        this.occurredAt = occurredAt ?? new Date();
    }
}
