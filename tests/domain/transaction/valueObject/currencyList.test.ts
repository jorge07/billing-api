import Price from 'domain/transaction/valueObject/price';
import { currencies } from 'domain/transaction/valueObject/currencyList';

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
