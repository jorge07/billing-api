import { Domain } from "hollywood-js";
import { AggregateRootId } from "hollywood-js/src/Domain";
import Price from "../valueObject/price";

export default class TransactionWasCreated extends Domain.DomainEvent {
    constructor(
        public readonly uuid: AggregateRootId,
        public readonly product: string,
        public readonly price: Price,
    ) {
        super();
    }
}
