import TransactionId from "Domain/Transaction/ValueObject/TransactionId";
import { IQuery } from "hollywood-js/src/Application";

export default class GetOneQuery implements IQuery {
    public readonly uuid: TransactionId;
    constructor(uuid: string) {
        this.uuid = new TransactionId(uuid);
    }
}
