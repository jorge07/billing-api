# Billing API


![Lint Status](https://github.com/jorge07/billing-api/workflows/Lint/badge.svg)
![Tests Status](https://github.com/jorge07/billing-api/workflows/Tests/badge.svg)

A Typescript project to demostrate how to work with:

- DDD
- CQRS
- Event Sourcing
- Dependency injection container for 
  - Parameters
  - Services
- Mockless tests
- In Memory Store for tests
- Unit, Integration and E2E testing with jest and supertest
- Typescript Dev Env with debugger and all funcy stuff.
- Docker
- Kubernetes
- Helm
- Custom metrics
- Prometheus
- Grafana

## Project Structure

```
config/           -> Project configuration for parameters and DI services
etc/
   artifact/
      chart/      -> Kubernetes helm chart
      Dockerfile  -> The artifact to deploy
   env/
      dev/        -> Dev Stack
      minikube/   -> Minikube Stack
src/
  application/    -> Application layer (Use Cases)
  domain/         -> Domain Logic
  infrastructure  -> Implementation details
  ui/
    console/      -> CLI
    http/         -> HTTP Server
  kernel.ts       -> Project Kernel
tests/            -> Tests directory
```

## Setup

Look at makefile

- `make mk-setup` to build the minikube stack
- `yarn dev` to star dev environment

## Stack

- Billing API and Worker/s
- Postgres
- RabbitMQ
- Prometheus Operator
- Alert manager
- Grafana + built in BillingAPI dasboard

### Screenshots

- Api

![Get Transaction](https://i.imgur.com/RFDOvaT.png)

- Grafana

![Dash](https://i.imgur.com/g6wGwgX.png)

- Prom Rules

![PrometheusRules](https://i.imgur.com/HS4lMoA.png)
![PrometheusRules](https://i.imgur.com/SZG76IG.png)
