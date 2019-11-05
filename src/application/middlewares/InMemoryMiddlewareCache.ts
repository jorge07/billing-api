import IMiddleware from "hollywood-js/src/Application/Bus/Middelware";

export default class InMemoryMiddlewareCache implements IMiddleware {

    private cache: {[key: string]: any} =  {};

    public async execute(command: any, next: (command: any) => any) {
        const commandHash = JSON.stringify(command);

        if (this.cache[commandHash]) {
            return this.cache[commandHash];
        }

        const result = await next(command);

        this.cache[commandHash] = result;

        return result;
    }
}
