import Transaction from "./transaction";
import { TransactionID } from "./transactionId";

export default interface IRepository {
    get(id: TransactionID): Promise<any|null>;
}
