import prom, {CounterConfiguration} from "prom-client";

export default function probe() {

    return {
        counter: (conf: CounterConfiguration<string>) => {
            return new prom.Counter(conf)
        },
        gauge: prom.Gauge,
        histogram: prom.Histogram,
        summary: prom.Summary,
    }

}