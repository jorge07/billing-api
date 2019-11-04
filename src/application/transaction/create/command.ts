import { ICommand } from "hollywood-js/src/Application";

export default class CreateCommand implements ICommand {
    constructor(
        public readonly uuid: string,
        public readonly product: string,
        public readonly price: string,
    ) { }
}
