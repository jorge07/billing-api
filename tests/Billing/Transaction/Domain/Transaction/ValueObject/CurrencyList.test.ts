import {currencies} from "@Transaction/Domain/ValueObject/CurrencyList";

describe("Currency lists", () => {
    test("Known Currency", () => {
        expect(currencies.includes("EUR")).toBe(true);
    });

    test("Unknown Currency", () => {
        expect(currencies.includes("GBP")).toBe(false);
    });
});
