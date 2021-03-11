export default class ConflictException extends Error {
    constructor(message: string = "Conflict found") {
        super(message);
    }
}
