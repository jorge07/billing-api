import { currencies } from "./currencyList";
import InvalidArgumentException from 'domain/shared/exceptions/invalidArgumentException';

export default class Price {

    public readonly amount: number;
    public readonly currency: string;

    constructor(
        amount: number,
        currency: string,
    ) {
        this.validateAmount(amount);
        this.validateCurrency(currency);

        this.amount = amount;
        this.currency = currency;
    }

    private validateCurrency(currency: string): void {
        if (!currencies.includes(currency)) {
            throw new InvalidArgumentException("Unknown currency");
        }
    }

    private validateAmount(amount: number): void {
        if (Math.sign(amount) < 0) {
            throw new InvalidArgumentException("Negative prices not allowed");
        }
    }
}
