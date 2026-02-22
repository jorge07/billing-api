import { Domain } from "hollywood-js";
import Price from "@Transaction/Domain/ValueObject/Price";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import InvalidArgumentException from "@Shared/Domain/Exceptions/InvalidArgumentException";

const FIXED_UUID = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";

describe("Transaction", () => {
    test("Create transaction", () => {
        const price = new Price("2", "EUR");
        const transactionID = new TransactionId(FIXED_UUID);
        const instance = Transaction.create(transactionID, "product", price);
        const stream = instance.getUncommittedEvents();

        const event = stream.events[0].event as TransactionWasCreated;

        expect(instance.getAggregateRootId().toString()).toBe(FIXED_UUID);
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect(event.product).toBe("product");
        expect(event.amount).toBe(price.amount);
        expect(event.currency).toBe(price.currency);
        expect(instance.version()).toBe(0);
    });

    test("Creating a transaction with a negative price is rejected by the domain", () => {
        const transactionID = new TransactionId(FIXED_UUID);
        expect(() => Transaction.create(transactionID, "product", new Price("-1", "EUR")))
            .toThrow(InvalidArgumentException);
    });

    test("Creating a transaction with an unknown currency is rejected by the domain", () => {
        const transactionID = new TransactionId(FIXED_UUID);
        expect(() => Transaction.create(transactionID, "product", new Price("10", "GBP")))
            .toThrow(InvalidArgumentException);
    });
});
