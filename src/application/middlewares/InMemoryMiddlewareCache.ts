import IMiddleware from "hollywood-js/src/Application/Bus/Middelware";
import Probe from "infrastructure/shared/audit/probe";
import {Counter} from "prom-client";

export default class InMemoryMiddlewareCache implements IMiddleware {

    private cache: {[key: string]: any} =  {};
    private hitCounter: Counter<string>;
    private missCounter: Counter<string>;

    constructor() {
        this.hitCounter = Probe.counter({
            help: "cache_middleware_hit",
            labelNames: [
                "query",
            ],
            name: "cache_middleware_hit",
        });
        this.missCounter = Probe.counter({
            help: "cache_middleware_miss",
            labelNames: [
                "query",
            ],
            name: "cache_middleware_miss",
        });
    }

    public async execute(query: any, next: (command: any) => any) {
        const commandHash = JSON.stringify(query);

        if (this.cache[commandHash]) {
            this.hitCounter.inc({query: typeof query});
            return this.cache[commandHash];
        }

        const result = await next(query);

        this.cache[commandHash] = result;

        this.missCounter.inc({query: typeof query});
        return result;
    }

    public flush() {
        this.cache = {};
    }
}
