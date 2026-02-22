/**
 * Thrown when a domain command is applied to an aggregate in the wrong state.
 *
 * Source: Vernon (IDDD), ch. 7 — "Domain events model what happened. A full
 * lifecycle requires events for each significant state transition, and each
 * transition must be guarded by invariants that prevent invalid moves."
 */
export default class InvalidStateException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidStateException";
    }
}
