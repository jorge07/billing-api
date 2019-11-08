import Price from '../../../../../src/domain/transaction/valueObject/price';
import { currencies } from '../../../../../src/domain/transaction/valueObject/currencyList';
import InvalidArgumentException from '../../../../../src/infrastructure/shared/exceptions/invalidArgumentException';

describe("Currency lists", () => {
    test("Known Currency", () => {
        const currencyList = currencies;

        expect(currencies.includes("EUR")).toBe(true);
    });
    
    test("Unknown Currency", () => {
        const currencyList = currencies;

        expect(currencies.includes("GBP")).toBe(false);
    });
});
