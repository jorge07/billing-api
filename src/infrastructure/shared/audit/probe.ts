import * as prom from "prom-client";

export default class Probe {
    counter(conf: prom.CounterConfiguration<string>) {
        return new prom.Counter(conf)
    }
};
