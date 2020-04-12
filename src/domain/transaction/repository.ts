import type TransactionID from "./valueObject/transactionId";

export default interface IRepository {
    get(id: TransactionID): Promise<any|null>;
}
