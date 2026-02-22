import Probe from "@Shared/Infrastructure/Audit/Probe";
import { Application } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import type { Counter } from "prom-client";
import ConflictException from "../../../Shared/Domain/Exceptions/ConflictException";
import Transaction from "../../Domain/Transaction";
import ITransactionWriteRepository from "../../Domain/WriteRepository";
import CreateCommand from "./Command";

@injectable()
export default class Create implements Application.ICommandHandler {
    private readonly conflicts: Counter<string>;
    private readonly error: Counter<string>;
    private readonly success: Counter<string>;

    constructor(
        @inject("infrastructure.transaction.writeRepository")
        private readonly writeModel: ITransactionWriteRepository,
    ) {
        this.error = Probe.counter({ name: "transaction_create_error", help: "Counter of the incremental transaction create errors"});
        this.conflicts = Probe.counter({ name: "transaction_create_conflict", help: "Counter of the incremental transaction create conflicts"});
        this.success = Probe.counter({ name: "transaction_create_success", help: "Counter of the incremental transaction create success"});
    }

    @Application.autowiring
    public async handle(command: CreateCommand): Promise<void | IAppError> {
        if (await this.writeModel.exists(command.uuid)) {
            this.conflicts.inc(1);
            throw new ConflictException("Already exists");
        }

        const transaction: Transaction = Transaction.create(
            command.uuid,
            command.product,
            command.price,
        );

        try {
            await this.writeModel.save(transaction);
            this.success.inc(1);
        } catch (err) {
            this.error.inc(1);
            throw err;
        }
    }
}
