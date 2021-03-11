import { IQuery } from "hollywood-js/src/Application";
import TransactionId from "../../Domain/ValueObject/TransactionId";

export default class GetOneQuery implements IQuery {
    public readonly uuid: TransactionId;
    constructor(uuid: string) {
        this.uuid = new TransactionId(uuid);
    }
}
