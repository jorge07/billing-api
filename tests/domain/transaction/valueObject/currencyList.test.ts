import { currencies } from "domain/transaction/valueObject/currencyList";

describe("Currency lists", () => {
    test("Known Currency", () => {
        expect(currencies.includes("EUR")).toBe(true);
    });

    test("Unknown Currency", () => {
        expect(currencies.includes("GBP")).toBe(false);
    });
});
