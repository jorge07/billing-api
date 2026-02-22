import { Domain } from "hollywood-js";
import InvalidStateException from "../../Shared/Domain/Exceptions/InvalidStateException";
import TransactionFailed from "./Events/TransactionFailed";
import TransactionWasConfirmed from "./Events/TransactionWasConfirmed";
import TransactionWasCreated from "./Events/TransactionWasCreated";
import TransactionWasRefunded from "./Events/TransactionWasRefunded";
import Price from "./ValueObject/Price";
import type TransactionId from "./ValueObject/TransactionId";
import { TransactionStatus } from "./ValueObject/TransactionStatus";

export default class Transaction extends Domain.EventSourcedAggregateRoot {

    public static create(uuid: TransactionId, product: string, price: Price): Transaction {
        const instance = new Transaction(uuid.toIdentity());

        instance.raise(new TransactionWasCreated(
            uuid.toString(),
            product,
            price.amount,
            price.currency,
        ));

        return instance;
    }

    private price?: Price;
    private product: string = "";
    private status: TransactionStatus = TransactionStatus.PENDING;

    constructor(uuid: Domain.Identity) {
        super(uuid);
        this.registerHandler(TransactionWasCreated,   (event) => this.onTransactionWasCreated(event));
        this.registerHandler(TransactionWasConfirmed, (event) => this.onTransactionWasConfirmed(event));
        this.registerHandler(TransactionFailed,       (event) => this.onTransactionFailed(event));
        this.registerHandler(TransactionWasRefunded,  (event) => this.onTransactionWasRefunded(event));
    }

    /**
     * Confirm a pending transaction.
     * Guard: only PENDING transactions can be confirmed.
     */
    public confirm(): void {
        if (this.status !== TransactionStatus.PENDING) {
            throw new InvalidStateException(
                `Cannot confirm a transaction in state ${this.status}`,
            );
        }
        this.raise(new TransactionWasConfirmed(this.getAggregateRootId().toString()));
    }

    /**
     * Mark a pending transaction as failed.
     * Guard: only PENDING transactions can fail.
     */
    public fail(reason: string): void {
        if (this.status !== TransactionStatus.PENDING) {
            throw new InvalidStateException(
                `Cannot fail a transaction in state ${this.status}`,
            );
        }
        this.raise(new TransactionFailed(this.getAggregateRootId().toString(), reason));
    }

    /**
     * Refund a confirmed transaction.
     * Guard: only CONFIRMED transactions can be refunded.
     */
    public refund(): void {
        if (this.status !== TransactionStatus.CONFIRMED) {
            throw new InvalidStateException(
                `Cannot refund a transaction in state ${this.status}`,
            );
        }
        this.raise(new TransactionWasRefunded(this.getAggregateRootId().toString()));
    }

    private onTransactionWasCreated(event: TransactionWasCreated): void {
        this.product = event.product;
        this.price = new Price(event.amount, event.currency);
        this.status = TransactionStatus.PENDING;
    }

    private onTransactionWasConfirmed(event: TransactionWasConfirmed): void {
        this.status = TransactionStatus.CONFIRMED;
    }

    private onTransactionFailed(event: TransactionFailed): void {
        this.status = TransactionStatus.FAILED;
    }

    private onTransactionWasRefunded(event: TransactionWasRefunded): void {
        this.status = TransactionStatus.REFUNDED;
    }

    get pricing(): Price {
        return this.price!;
    }

    get productName(): string {
        return this.product;
    }

    get currentStatus(): TransactionStatus {
        return this.status;
    }
}
