import { Domain } from "hollywood-js";
import InvalidArgumentException from "../Exceptions/InvalidArgumentException";

export default abstract class Uuid {

    private readonly identity: Domain.Identity;

    constructor(value?: string) {
        try {
            this.identity = value
                ? Domain.Identity.fromString(value)
                : Domain.Identity.generate();
        } catch {
            throw new InvalidArgumentException("Invalid uuid");
        }
    }

    public toString(): string {
        return this.identity.toString();
    }

    public toIdentity(): Domain.Identity {
        return this.identity;
    }

    /**
     * Value Object equality — two UUID-based identities are equal when
     * they represent the same UUID string value.
     *
     * Source: Evans (Blue Book), p. 98 — "Value objects should be
     * testable for equality."
     */
    public equals(other: Uuid): boolean {
        return this.toString() === other.toString();
    }
}
