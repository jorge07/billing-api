export default class NotFoundException extends Error {
    constructor(message: string = "Not found") {
        super(message);
    }
}
