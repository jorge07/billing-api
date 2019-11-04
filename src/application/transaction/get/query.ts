import { IQuery } from "hollywood-js/src/Application";

export default class GetOne implements IQuery {
    constructor(public readonly uuid: string) {}
}
