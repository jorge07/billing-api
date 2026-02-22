import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";

const UUID_A = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";
const UUID_B = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

describe("TransactionId", () => {
    test("two ids with the same UUID are equal", () => {
        expect(new TransactionId(UUID_A).equals(new TransactionId(UUID_A))).toBe(true);
    });

    test("two ids with different UUIDs are not equal", () => {
        expect(new TransactionId(UUID_A).equals(new TransactionId(UUID_B))).toBe(false);
    });

    test("generates a unique id when constructed without value", () => {
        const a = new TransactionId();
        const b = new TransactionId();
        expect(a.equals(b)).toBe(false);
    });

    test("Invalid UUID is rejected", () => {
        expect(() => new TransactionId("not-a-uuid")).toThrow();
    });
});
