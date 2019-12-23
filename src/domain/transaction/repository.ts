import Transaction from "./transaction";
import TransactionID from "./valueObject/transactionId";

export default interface IRepository {
    get(id: TransactionID): Promise<any|null>;
}
