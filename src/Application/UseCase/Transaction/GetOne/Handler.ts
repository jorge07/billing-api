import NotFoundException from "Domain/Shared/Exceptions/NotFoundException";
import IRepository from "Domain/Transaction/Repository";
import { Application } from "hollywood-js";
import { EventStore } from "hollywood-js";
import { inject, injectable } from "inversify";
import GetOneQuery from "./Query";

@injectable()
export default class GetOne implements Application.IQueryHandler {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly repository: IRepository,
    ) {}

    @Application.autowiring
    public async handle(request: GetOneQuery): Promise<Application.IAppResponse | Application.IAppError> {
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
