import InvalidArgumentException from "Domain/Shared/Exceptions/InvalidArgumentException";
import { currencies } from "./CurrencyList";

export default class Price {

    private static validateCurrency(currency: string): void {
        if (!currencies.includes(currency)) {
            throw new InvalidArgumentException("Unknown currency");
        }
    }

    private static validateAmount(amount: number): void {
        if (isNaN(amount)) {
            throw new InvalidArgumentException("Amount is not a number");
        }

        if (Math.sign(amount) < 0) {
            throw new InvalidArgumentException("Negative prices not allowed");
        }
    }

    public readonly amount: number;
    public readonly currency: string;

    constructor(
        amount: number,
        currency: string,
    ) {
        Price.validateAmount(amount);
        Price.validateCurrency(currency);

        this.amount = amount;
        this.currency = currency;
    }
}
