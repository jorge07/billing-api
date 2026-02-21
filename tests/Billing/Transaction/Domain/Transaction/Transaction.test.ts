import { Domain } from "hollywood-js";
import Price from "@Transaction/Domain/ValueObject/Price";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";

describe("Transaction", () => {
    test("Create transaction", () => {
        const price = new Price(2, "EUR");
        const transactionID = new TransactionId("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
        const instance = Transaction.create(transactionID, "product", price);
        const stream = instance.getUncommittedEvents();

        expect(instance.getAggregateRootId().toString()).toBe("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect((stream.events[0].event as TransactionWasCreated).product).toBe("product");
        expect((stream.events[0].event as TransactionWasCreated).price).toBe(price);
        expect(instance.version()).toBe(0);
    });
});
