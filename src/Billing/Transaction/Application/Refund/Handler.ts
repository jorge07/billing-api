import { Application } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import NotFoundException from "../../../Shared/Domain/Exceptions/NotFoundException";
import ITransactionWriteRepository from "../../Domain/WriteRepository";
import RefundCommand from "./Command";

@injectable()
export default class Refund implements Application.ICommandHandler {
    constructor(
        @inject("infrastructure.transaction.writeRepository")
        private readonly writeModel: ITransactionWriteRepository,
    ) {}

    @Application.autowiring
    public async handle(command: RefundCommand): Promise<void | IAppError> {
        if (!await this.writeModel.exists(command.uuid)) {
            throw new NotFoundException("Transaction not found");
        }
        const transaction = await this.writeModel.load(command.uuid);
        transaction.refund();
        await this.writeModel.save(transaction);
    }
}
