import type { ICommand } from "hollywood-js/src/Application";
import TransactionId from "../../Domain/ValueObject/TransactionId";

export default class FailCommand implements ICommand {
    public readonly uuid: TransactionId;

    constructor(
        uuid: string,
        public readonly reason: string,
    ) {
        this.uuid = new TransactionId(uuid);
    }
}
