import { Application } from "hollywood-js";
import { EventSourcing } from "hollywood-js";
import { IAppError, IAppResponse } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import NotFoundException from "../../../Shared/Domain/Exceptions/NotFoundException";
import IRepository from "../../Domain/Repository";
import GetOneQuery from "./Query";

@injectable()
export default class GetOne implements Application.IQueryHandler {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly repository: IRepository,
    ) {}

    @Application.autowiring
    public async handle(request: GetOneQuery): Promise<IAppResponse | IAppError> {
        try {
            const transaction = await this.repository.get(request.uuid);

            return {
                data: transaction,
                meta: [],
            };

        } catch (err) {
            if (err instanceof EventSourcing.AggregateRootNotFoundException) {
                throw new NotFoundException();
            }

            throw err;
        }
    }
}
