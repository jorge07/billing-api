export default class InvalidArgumentException extends Error {
    constructor(message: string = "Invalid argument") {
        super(message);
    }
}
