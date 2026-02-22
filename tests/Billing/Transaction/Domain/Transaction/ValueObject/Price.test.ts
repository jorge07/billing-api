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
});
