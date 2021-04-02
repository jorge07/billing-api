import type { Domain } from "hollywood-js";
import validate from "uuid-validate";
import v4 from "uuid/v4";
import InvalidArgumentException from "../Exceptions/InvalidArgumentException";

export default abstract class Uuid {

    public static isValid(candidate: string): void {
        if (! validate(candidate, 4)) {
            throw new InvalidArgumentException("Invalid uuid");
        }
    }

    private static validateUuid(value: string): string {
        Uuid.isValid(value);
        return value;
    }

    private readonly uuid: Domain.AggregateRootId;

    constructor(value?: string) {
        this.uuid = !value ? v4() : Uuid.validateUuid(value);
    }

    public toString(): Domain.AggregateRootId {

        return this.uuid;
    }
}
