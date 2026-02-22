import type TransactionId from "./ValueObject/TransactionId";
import type { TransactionStatus } from "./ValueObject/TransactionStatus";

/**
 * Read model projection for a Transaction.
 *
 * Carries only primitive data — no domain objects — so it is safe to serialize,
 * cache, and return across boundaries without coupling callers to the aggregate.
 */
export interface ITransactionReadDTO {
    uuid: string;
    product: string;
    priceAmount: number;
    priceCurrency: string;
    status: TransactionStatus;
    createdAt: Date;
}

export default interface IRepository {
    get(id: TransactionId): Promise<ITransactionReadDTO | null>;
    save(dto: ITransactionReadDTO): Promise<void>;
    updateStatus(uuid: string, status: TransactionStatus): Promise<void>;
}
