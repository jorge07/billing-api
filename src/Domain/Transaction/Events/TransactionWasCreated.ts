import { Domain } from "hollywood-js";
import type { AggregateRootId } from "hollywood-js/src/Domain";
import type Price from "../ValueObject/Price";

export default class TransactionWasCreated extends Domain.DomainEvent {
    constructor(
        public readonly uuid: AggregateRootId,
        public readonly product: string,
        public readonly price: Price,
    ) {
        super();
    }
}
