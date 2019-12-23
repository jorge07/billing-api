import NotFoundException from "domain/shared/exceptions/notFoundException";
import IRepository from "domain/transaction/repository";
import { Application } from "hollywood-js";
import { EventStore } from "hollywood-js";
import Log from "infrastructure/shared/audit/logger";
import { inject, injectable } from "inversify";
import GetOne from "./query";

@injectable()
export default class Get implements Application.IQueryHandler {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly repository: IRepository,
    ) {}

    @Application.autowiring
    public async handle(request: GetOne): Promise<Application.IAppResponse | Application.IAppError> {
        try {
            const transaction = await this.repository.get(request.uuid);

            return {
                data: transaction,
                meta: [],
            };

        } catch (err) {
            if (err instanceof EventStore.AggregateRootNotFoundException) {
                throw new NotFoundException();
            }

            throw err;
        }
    }
}
