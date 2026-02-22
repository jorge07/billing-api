import { Application } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import NotFoundException from "../../../Shared/Domain/Exceptions/NotFoundException";
import ITransactionWriteRepository from "../../Domain/WriteRepository";
import ConfirmCommand from "./Command";

@injectable()
export default class Confirm implements Application.ICommandHandler {
    constructor(
        @inject("infrastructure.transaction.writeRepository")
        private readonly writeModel: ITransactionWriteRepository,
    ) {}

    @Application.autowiring
    public async handle(command: ConfirmCommand): Promise<void | IAppError> {
        if (!await this.writeModel.exists(command.uuid)) {
            throw new NotFoundException("Transaction not found");
        }
        const transaction = await this.writeModel.load(command.uuid);
        transaction.confirm();
        await this.writeModel.save(transaction);
    }
}
