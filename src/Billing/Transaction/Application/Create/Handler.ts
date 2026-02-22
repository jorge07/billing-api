import Probe from "@Shared/Infrastructure/Audit/Probe";
import { Application, EventSourcing } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import type { Counter } from "prom-client";
import ConflictException from "../../../Shared/Domain/Exceptions/ConflictException";
import Transaction from "../../Domain/Transaction";
import CreateCommand from "./Command";

@injectable()
export default class Create implements Application.ICommandHandler {
    private readonly conflicts: Counter<string>;
    private readonly error: Counter<string>;
    private readonly success: Counter<string>;

    constructor(
        @inject(
            "infrastructure.transaction.eventStore",
        ) private readonly writeModel: EventSourcing.EventStore<Transaction>,
    ) {
        this.error = Probe.counter({ name: "transaction_create_error", help: "Counter of the incremental transaction create errors"});
        this.conflicts = Probe.counter({ name: "transaction_create_conflict", help: "Counter of the incremental transaction create conflicts"});
        this.success = Probe.counter({ name: "transaction_create_success", help: "Counter of the incremental transaction create success"});
    }

    @Application.autowiring
    public async handle(command: CreateCommand): Promise<void | IAppError> {

        try {
            await this.writeModel.load(command.uuid.toIdentity());
            this.conflicts.inc(1);
            throw new ConflictException("Already exists");
        } catch (err) {
            if (err instanceof ConflictException) {
                throw err;
            }
            if (!(err instanceof EventSourcing.AggregateRootNotFoundException)) {
                this.error.inc(1);
                throw err;
            }
        }

        const transaction: Transaction = Transaction.create(
            command.uuid,
            command.product,
            command.price,
        );

        await this.writeModel.save(transaction);
        this.success.inc(1);
    }
}
