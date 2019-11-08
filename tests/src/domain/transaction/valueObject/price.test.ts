import Price from '../../../../../src/domain/transaction/valueObject/price';
import InvalidArgumentException from '../../../../../src/infrastructure/shared/exceptions/invalidArgumentException';

describe("Price", () => {
    test("Create Price VO from Scalars", () => {
        const instance = new Price(12.5, "EUR");

        expect(instance.currency).toBe("EUR");
        expect(instance.amount).toBe(12.5);
    });

    test("Invalid Currency", () => {
        const todo = () => new Price(12.5, "GBP");
        
        expect(todo).toThrow(InvalidArgumentException);
    });
});
