import { IQuery } from "hollywood-js/src/Application";
import TransactionID from "../../../../domain/transaction/valueObject/transactionId";

export default class GetOne implements IQuery {
    public readonly uuid: TransactionID;
    constructor(uuid: string) {
        this.uuid = new TransactionID(uuid);
    }
}
