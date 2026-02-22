/**
 * Represents the lifecycle state of a Transaction aggregate.
 *
 * Valid transitions:
 *   PENDING  → CONFIRMED  (via confirm())
 *   PENDING  → FAILED     (via fail())
 *   CONFIRMED → REFUNDED  (via refund())
 */
export enum TransactionStatus {
    PENDING   = "PENDING",
    CONFIRMED = "CONFIRMED",
    FAILED    = "FAILED",
    REFUNDED  = "REFUNDED",
}
