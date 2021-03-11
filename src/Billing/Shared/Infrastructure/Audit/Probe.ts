import * as prom from "prom-client";

export default class Probe {
    public static counter(conf: prom.CounterConfiguration<string>) {
        return new prom.Counter(conf);
    }

    public static histogram(conf: prom.HistogramConfiguration<string>) {
        return new prom.Histogram(conf);
    }
}
