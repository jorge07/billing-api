# Billing API

![Lint Status](https://github.com/jorge07/billing-api/workflows/Lint/badge.svg)
[![Tests](https://github.com/jorge07/billing-api/actions/workflows/test.yml/badge.svg)](https://github.com/jorge07/billing-api/actions/workflows/test.yml)

A Typescript project to demostrate how to work withall of this while keeping ultra fast speed:

- DDD & CQRS & Event Sourcing
- Dependency injection
- Mockless tests
- Unit, Integration and E2E testing
- Kubernetes + Helm + Prometheus + Custom metrics + Grafana

TODO
- https://github.com/helm/charts/tree/master/stable/prometheus-adapter

## Documentation

[Jump into the documentation for in deep information](doc/README.md)

## Setup

[Dev and Minikube environments](doc/envs.md)

Requirements:

- Nodejs
- yarn
- Docker
- Docker Compose

Start the project:

```sh
yarn install && yarn dev
```

## Stack

- Billing API and Worker/s
- Postgres
- RabbitMQ
- Prometheus Operator
- Alert manager
- Grafana + built in BillingAPI Dasboard

## Screenshots

### API

![Get Transaction](https://i.imgur.com/RFDOvaT.png)

### Grafana

![Dash](https://i.imgur.com/84YoLck.png)

### Prom Rules

![PrometheusRules](https://i.imgur.com/HS4lMoA.png)
![PrometheusRules](https://i.imgur.com/SZG76IG.png)
