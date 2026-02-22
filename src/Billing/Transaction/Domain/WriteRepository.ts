import type Transaction from "./Transaction";
import type TransactionId from "./ValueObject/TransactionId";

/**
 * Write-side repository interface for the Transaction aggregate.
 *
 * Abstracts the EventStore so command handlers depend on a domain interface
 * instead of the infrastructure EventStore class directly, and to encapsulate
 * the existence check cleanly.
 *
 * Source: Vernon (IDDD), p. 356 — "Command handlers orchestrate; they do not
 * query to make decisions." Using exists() avoids catch-to-check anti-pattern.
 */
export default interface ITransactionWriteRepository {
    exists(id: TransactionId): Promise<boolean>;
    load(id: TransactionId): Promise<Transaction>;
    save(transaction: Transaction): Promise<void>;
}
