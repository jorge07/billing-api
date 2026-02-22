import Price from "@Transaction/Domain/ValueObject/Price";
import InvalidArgumentException from "@Shared/Domain/Exceptions/InvalidArgumentException";

describe("Price", () => {
    test("Create Price VO from Scalars", () => {
        const instance = new Price("12.5", "EUR");

        expect(instance.currency).toBe("EUR");
        expect(instance.amount).toBe("12.5");
    });

    test("Invalid Currency", () => {
        const todo = () => new Price("12.5", "GBP");
        expect(todo).toThrow(InvalidArgumentException);
    });

    test("Negative amount is rejected", () => {
        const todo = () => new Price("-1", "EUR");
        expect(todo).toThrow(InvalidArgumentException);
    });

    test("Non-numeric amount is rejected", () => {
        const todo = () => new Price("abc", "EUR");
        expect(todo).toThrow(InvalidArgumentException);
    });

    describe("equals", () => {
        test("two prices with the same amount and currency are equal", () => {
            expect(new Price("10.00", "EUR").equals(new Price("10.00", "EUR"))).toBe(true);
        });

        test("prices with different amounts are not equal", () => {
            expect(new Price("10.00", "EUR").equals(new Price("9.99", "EUR"))).toBe(false);
        });

        test("prices with different currencies are not equal", () => {
            expect(new Price("10.00", "EUR").equals(new Price("10.00", "USD"))).toBe(false);
        });
    });
});
