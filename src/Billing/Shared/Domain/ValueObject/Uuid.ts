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
}
