import { injectable } from "inversify";
import NotFoundException from "@Shared/Domain/Exceptions/NotFoundException";
import IRepository, { ITransactionReadDTO } from "@Transaction/Domain/Repository";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import { TransactionStatus } from "@Transaction/Domain/ValueObject/TransactionStatus";

/**
 * In-memory IRepository implementation for use in integration tests.
 * Replaces the GenericInMemoryRepository + InMemoryReadModelRepository<any>
 * combo with a properly typed, interface-compliant test double.
 */
@injectable()
export class InMemoryReadModelRepository implements IRepository {
    private readonly store = new Map<string, ITransactionReadDTO>();

    public async get(id: TransactionId): Promise<ITransactionReadDTO | null> {
        const dto = this.store.get(id.toString());
        if (!dto) {
            throw new NotFoundException("Transaction not found");
        }
        return dto;
    }

    public async save(dto: ITransactionReadDTO): Promise<void> {
        this.store.set(dto.uuid, dto);
    }

    public async updateStatus(uuid: string, status: TransactionStatus): Promise<void> {
        const existing = this.store.get(uuid);
        if (existing) {
            this.store.set(uuid, { ...existing, status });
        }
    }
}
