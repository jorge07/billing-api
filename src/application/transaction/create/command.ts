import { ICommand } from "hollywood-js/src/Application";
import Price from "../../../domain/transaction/valueObject/price";

export default class CreateCommand implements ICommand {
    public readonly price: Price;

    constructor(
        public readonly uuid: string,
        public readonly product: string,
        price: { amount: number, currency: string },
    ) {
        this.price = new Price(price.amount, price.currency);
    }
}
