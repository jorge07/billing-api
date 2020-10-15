import type { Domain } from "hollywood-js";
import * as validate from "uuid-validate";
import v4 from "uuid/v4";
import InvalidArgumentException from "../Exceptions/InvalidArgumentException";

export default abstract class Uuid {

    public static isValid(candidate: string): void {
        if (! validate(candidate, 4)) {
            throw new InvalidArgumentException("Invalid uuid");
        }
    }

    private uuid: Domain.AggregateRootId;

    constructor(value?: string) {
        if (! value) {
            this.uuid = v4();
        } else {
            this.setUuid(value);
        }
    }

    public toString(): Domain.AggregateRootId {

        return this.uuid;
    }

    private setUuid(value: string) {
        Uuid.isValid(value);
        this.uuid = value;
    }
}
