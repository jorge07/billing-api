# Monitoring

The application expose the metrics in the prometehus format at `9800/metrics`.

## Prometheus Service Scraping

Port 9800 is named `metrics` in the Kubernetes Deployment and Service.

We're going to define a ServiceMonitor object in the Prometheus Operator values.yaml pointing to the Service.
To do that we define the `matchLabels` with the label of the release, the namespace it will be living and the endpoint we're going to scrape.

```yaml
    additionalServiceMonitors:
    - name: billing-api
      selector:
        matchLabels:
          app.kubernetes.io/instance: api
      namespaceSelector:
        matchNames:
          - default
      endpoints:
        - port: metrics
          interval: 10s
```

## Prometheus Rules

Having the raw metrics can be slow and expensive in terms of memory consumption. For this reason is recommended to generate Prometheus Rules to pre-calculate this information. By doing this you can also increase the speed of the dashboard and if decide to go to a long term storage save tons of space. 

Another reason are the queries with regex that are way more expensive than without it. For long dataset this query can end having prometheus running out of memory:
```
sum(rate(http_request_duration_seconds_count{job="api-billing", status_code=~"5.."}[1m])) 
/ sum(rate(http_request_duration_seconds_count{job="api-billing"}[1m]))
```

To prevent this this we generate a `PrometheusRule` object, a CRD object from the Prometheus Operator that generate this rules in prometheus instances. Here an example with an increase in complexity:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: {{ include "billing.fullname" . }}
  labels:
    app: prometheus-operator
    release: api
    {{- include "billing.labels" . | nindent 4 }}
spec:
  groups:
  - name: billing-api.rules
    rules:
    - expr: sum(increase(transaction_create_success[1m]))
      record: billing:transactions:success:sum_increase_1m
    - expr: sum(increase(transaction_create_success[1h]))
      record: billing:transactions:success:sum_increase_1h
    - expr: sum(rate(http_request_duration_seconds_count{job="api-billing"}[5m]))
      record: billing:traffic:total_rate_5m
    - expr: |-
        sum(rate(http_request_duration_seconds_count{job="api-billing", status_code=~"5.."}[1m])) 
        / sum(rate(http_request_duration_seconds_count{job="api-billing"}[1m]))
      record: billing:traffic:server_error_rate_1m
    - expr: |-
        (
          sum(rate(http_request_duration_seconds_bucket{le="0.3", job="api-billing"}[5m]))
          +
          sum(rate(http_request_duration_seconds_bucket{le="1.5", job="api-billing"}[5m]))
        ) / 2 / billing:traffic:total_rate_5m
      record: billing:traffic:apdex_global_5m
```

To monitor the workers we start the monitor server to expose the metrics and follow the same rules to monitor the worker metrics.

## Visualisation in Grafana

To get all this information displayed in Grafana we define a `dashboardProvider` in grafana config of prometheus-operator and a dashboard with the JSON object.
Rember to use the Rules defined above in the charts.

```json
"targets": [
    {
        "expr": "billing:transactions:success:sum_increase_1m",
        "legendFormat": "Success",
        "refId": "A"
    },
    ...
```

The best way I found to work this this is edit the dashboard in the grafana UI and export the dashboard in JSON by clicking in save and putting this object in the grafana.yaml config file. By doing this we've in the CVS the changes applied in the charts.

## Important places to look at

Prometheus Operator came with VERY important built in alerts you can look at http://localhost:9090/alerts. Some of this critical alerts are:

Throttling:
```yaml
alert: CPUThrottlingHigh
expr: sum
  by(container, pod, namespace) (increase(container_cpu_cfs_throttled_periods_total{container!=""}[5m]))
  / sum by(container, pod, namespace) (increase(container_cpu_cfs_periods_total[5m]))
  > (25 / 100)
for: 15m
labels:
  severity: warning
annotations:
  message: '{{ $value | humanizePercentage }} throttling of CPU in namespace {{ $labels.namespace
    }} for container {{ $labels.container }} in pod {{ $labels.pod }}.'
  runbook_url: https://github.com/kubernetes-monitoring/kubernetes-mixin/tree/master/runbook.md#alert-name-cputhrottlinghigh
```
KubePodCrashLooping:
```yaml
alert: KubePodCrashLooping
expr: rate(kube_pod_container_status_restarts_total{job="kube-state-metrics",namespace=~".*"}[15m])
  * 60 * 5 > 0
for: 15m
labels:
  severity: critical
annotations:
  message: Pod {{ $labels.namespace }}/{{ $labels.pod }} ({{ $labels.container }})
    is restarting {{ printf "%.2f" $value }} times / 5 minutes.
  runbook_url: https://github.com/kubernetes-monitoring/kubernetes-mixin/tree/master/runbook.md#alert-name-kubepodcrashlooping
```
Stuck Jobs
```yaml
alert: KubeJobCompletion
expr: kube_job_spec_completions{job="kube-state-metrics",namespace=~".*"}
  - kube_job_status_succeeded{job="kube-state-metrics",namespace=~".*"}
  > 0
for: 1h
labels:
  severity: warning
annotations:
  message: Job {{ $labels.namespace }}/{{ $labels.job_name }} is taking more than
    one hour to complete.
  runbook_url: https://github.com/kubernetes-monitoring/kubernetes-mixin/tree/master/runbook.md#alert-name-kubejobcompletion
```

---

Because of this you can focus just on the things you care.

- CPU Usage and Idle CPU.
- Memory Usage, Limit and Idle.
- Network, RX TX 
- Healthy vs unhealthy Pods
- Pod restarts
- Performance
    - Avoid AVG response time.
    - Focus in Apdex and Percentiles
- Traffic
    - Server Error rate
    - Client Error rate
    - Not Found rate
    - Traffic by code, path
    - Req/s or req/m
    - Anomaly detections
        - Z-Score
        - Example:
            - Current traffic deviation: `stddev(rate(http_request_duration_seconds_count{job="api-billing"}[5m]))`
            - Prev week traffic deviation: `stddev(rate(http_request_duration_seconds_count{job="api-billing"}[5m] offset 1w))`
            - Max stddev toleration: `stddev(rate(traefik_entrypoint_requests_total{job="traefik-frontend-prometheus"}[5m] offset 1w))*1.2` -> Fill below to: Min stddev toleration for cool colours
            - Min stddev toleration: `stddev(rate(traefik_entrypoint_requests_total{job="traefik-frontend-prometheus"}[5m] offset 1w))*0.8`
            - Alert: `abs(1-stddev(rate(http_request_duration_seconds_count{job="api-billing"}[5m]))/stddev(rate(http_request_duration_seconds_count{job="api-billing"}[5m] offset 1w))) > 0.2` // Trigger alert if traffic is deviated by more than 20% up or down vs last week

## Alerting

### Setup

There're 2 options to generate alerts in this stack

- Grafana routing to `alertmanager`
- Prometheus Rules

Is up to you to decide what fits better fo you

### Triage

One of the most important things when dealing with an alert is the triage system and the visibility it expose.
In complex and/or distributed systems it's very useful to consider graphs to display the information.

There's a plugin for grafana call [Diagram Panel](https://grafana.com/grafana/plugins/jdbranham-diagram-panel) where you can define the graph in mermaid syntax and link it to particular queries.

[An example of this repo here](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcblxuSW5ncmVzc1tJbmdyZXNzXSAtLT58Um91dGUgdG8gfCBBUEl7QmlsbGluZyBBUEl9XG5BUEkgLS0-IENvbW1hbmRzXG5BUEkgLS0-IFF1ZXJpZXNcbkNvbW1hbmRzIC0tPnxXcml0ZXwgV01bV3JpdGUgTW9kZWwgREJdXG5Db21tYW5kcyAtLT58UHVibGlzaHwgUk1RW1JhYmJpdE1RIEV4Y2hhbmdlXSBcblJNUSAtLT58dG9waWN8IFF1ZXVlW0V2ZW50cyBRdWV1ZXNdXG5Xb3JrZXIoQVBJIFdvcmtlcnMpIC0tPiB8V3JpdGV8IFJNKFJlYWQgTW9kZWwgREIpXG5Xb3JrZXIgLS0-IHxDb25zdW1lc3xRdWV1ZVxuUXVlcmllcyAtLT4gfFJlYWR8IFJNXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

This is also included in the Grafana Dasboard

### Charts

Display the information in the correct way is as important as have the information.

- Think always in the next personl looking at the chart like if has not context about what is looking
- Add descritions in the charts to help to provide context about the numbers displayed
- Avoid logarithmic scales as much as you can. Use text panels to notify if not, so you can have a red alert text on top.
- Absolute numbers are useless 99% of the time
- Perspective matters. Start gaphs at 0 it's important mor of the time. Use the stddev or rate to monitor fluctuations.
- Avoid use the information of the metrics as a BI tool.

## Resources

https://www.investopedia.com/terms/z/zscore.asp
https://devconnected.com/the-definitive-guide-to-prometheus-in-2019/
https://prometheus.io/docs/introduction/overview/
https://prometheus.io/webtools/alerting/routing-tree-editor/
https://about.gitlab.com/blog/2019/07/23/anomaly-detection-using-prometheus/
