import Transaction from "./transaction";
import { TransactionID } from "./transactionId";

export default interface IRepository {
    save(transaction: Transaction): Promise<void>;
    get(id: TransactionID): Promise<Transaction|null>;
}
