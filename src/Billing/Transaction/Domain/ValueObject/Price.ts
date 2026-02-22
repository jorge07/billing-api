import InvalidArgumentException from "../../../Shared/Domain/Exceptions/InvalidArgumentException";
import { currencies } from "./CurrencyList";

/**
 * Money value object. Stores the amount as a decimal string to avoid
 * IEEE 754 floating-point precision loss. Use string arithmetic or a
 * dedicated decimal library (e.g., decimal.js) for money calculations.
 */
export default class Price {

    private static validateCurrency(currency: string): void {
        if (!currencies.includes(currency)) {
            throw new InvalidArgumentException("Unknown currency");
        }
    }

    private static validateAmount(amount: string): void {
        const parsed = Number(amount);

        if (isNaN(parsed)) {
            throw new InvalidArgumentException("Amount is not a number");
        }

        if (parsed < 0) {
            throw new InvalidArgumentException("Negative prices not allowed");
        }
    }

    public readonly amount: string;
    public readonly currency: string;

    constructor(
        amount: string,
        currency: string,
    ) {
        Price.validateAmount(amount);
        Price.validateCurrency(currency);

        this.amount = amount;
        this.currency = currency;
    }

    /**
     * Value Object equality — two Price instances are equal when they
     * represent the same amount in the same currency.
     *
     * Source: Evans (Blue Book), p. 98 — "Value objects should be
     * testable for equality."
     */
    public equals(other: Price): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}
