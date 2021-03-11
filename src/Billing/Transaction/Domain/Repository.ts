import type TransactionId from "./ValueObject/TransactionId";

export default interface IRepository {
    get(id: TransactionId): Promise<any|null>;
}
