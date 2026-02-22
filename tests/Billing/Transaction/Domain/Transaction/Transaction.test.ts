import { Domain } from "hollywood-js";
import Price from "@Transaction/Domain/ValueObject/Price";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import TransactionWasConfirmed from "@Transaction/Domain/Events/TransactionWasConfirmed";
import TransactionFailed from "@Transaction/Domain/Events/TransactionFailed";
import TransactionWasRefunded from "@Transaction/Domain/Events/TransactionWasRefunded";
import InvalidArgumentException from "@Shared/Domain/Exceptions/InvalidArgumentException";
import InvalidStateException from "@Shared/Domain/Exceptions/InvalidStateException";
import { TransactionStatus } from "@Transaction/Domain/ValueObject/TransactionStatus";

const FIXED_UUID = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";

function newTransaction(): Transaction {
    return Transaction.create(
        new TransactionId(FIXED_UUID),
        "product",
        new Price("2", "EUR"),
    );
}

describe("Transaction", () => {

    describe("create", () => {
        test("records TransactionWasCreated and starts in PENDING", () => {
            const instance = newTransaction();
            const stream = instance.getUncommittedEvents();
            const event = stream.events[0].event as TransactionWasCreated;

            expect(instance.getAggregateRootId().toString()).toBe(FIXED_UUID);
            expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
            expect(event.product).toBe("product");
            expect(event.amount).toBe("2");
            expect(event.currency).toBe("EUR");
            expect(instance.currentStatus).toBe(TransactionStatus.PENDING);
        });

        test("negative price is rejected by the domain", () => {
            expect(() => Transaction.create(new TransactionId(FIXED_UUID), "p", new Price("-1", "EUR")))
                .toThrow(InvalidArgumentException);
        });

        test("unknown currency is rejected by the domain", () => {
            expect(() => Transaction.create(new TransactionId(FIXED_UUID), "p", new Price("10", "GBP")))
                .toThrow(InvalidArgumentException);
        });
    });

    describe("confirm", () => {
        test("transitions a PENDING transaction to CONFIRMED", () => {
            const tx = newTransaction();
            tx.confirm();
            const events = tx.getUncommittedEvents().events;
            expect(tx.currentStatus).toBe(TransactionStatus.CONFIRMED);
            expect(events[1].event).toBeInstanceOf(TransactionWasConfirmed);
        });

        test("cannot confirm an already-confirmed transaction", () => {
            const tx = newTransaction();
            tx.confirm();
            expect(() => tx.confirm()).toThrow(InvalidStateException);
        });

        test("cannot confirm a failed transaction", () => {
            const tx = newTransaction();
            tx.fail("payment declined");
            expect(() => tx.confirm()).toThrow(InvalidStateException);
        });
    });

    describe("fail", () => {
        test("transitions a PENDING transaction to FAILED", () => {
            const tx = newTransaction();
            tx.fail("network error");
            const events = tx.getUncommittedEvents().events;
            expect(tx.currentStatus).toBe(TransactionStatus.FAILED);
            expect(events[1].event).toBeInstanceOf(TransactionFailed);
            expect((events[1].event as TransactionFailed).reason).toBe("network error");
        });

        test("cannot fail an already-confirmed transaction", () => {
            const tx = newTransaction();
            tx.confirm();
            expect(() => tx.fail("late")).toThrow(InvalidStateException);
        });
    });

    describe("refund", () => {
        test("transitions a CONFIRMED transaction to REFUNDED", () => {
            const tx = newTransaction();
            tx.confirm();
            tx.refund();
            const events = tx.getUncommittedEvents().events;
            expect(tx.currentStatus).toBe(TransactionStatus.REFUNDED);
            expect(events[2].event).toBeInstanceOf(TransactionWasRefunded);
        });

        test("cannot refund a PENDING transaction", () => {
            const tx = newTransaction();
            expect(() => tx.refund()).toThrow(InvalidStateException);
        });

        test("cannot refund a FAILED transaction", () => {
            const tx = newTransaction();
            tx.fail("error");
            expect(() => tx.refund()).toThrow(InvalidStateException);
        });
    });
});
