import type { ICommand } from "hollywood-js/src/Application";
import TransactionId from "../../Domain/ValueObject/TransactionId";

export default class RefundCommand implements ICommand {
    public readonly uuid: TransactionId;

    constructor(uuid: string) {
        this.uuid = new TransactionId(uuid);
    }
}
