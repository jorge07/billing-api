import * as prom from "prom-client";

export default class Probe {
    public counter(conf: prom.CounterConfiguration<string>) {
        return new prom.Counter(conf);
    }

    public histogram(conf: prom.HistogramConfiguration<string>) {
        return new prom.Histogram(conf);
    }
}
