# APP

The application is an API that store and retrieve transactions.

Built following:
- DDD 
- CQRS

## Use Cases

- **Create Transaction**: Any user can create a transaction given:
    - A valid uuidv4
    - A valid price 
        - Numeric >= 0
        - String Currency 
    - A product name, any string

- **Get Transaction**: Any user can retrieve a transaction given a valid uuidv4

## Exposed metrics

Counters:
- transaction_create_success
- transaction_create_conflict
- transaction_create_error

Histogram:
- events_worker_duration_seconds_sum
- events_worker_duration_seconds_count
- events_worker_duration_seconds_bucket
- http_request_duration_seconds_count
- http_request_duration_seconds_sum
- http_request_duration_seconds_bucket

## Architecture

Storage:
- Postgres
    - WriteModel DB
    - ReadModel DB

Messaging:
- RabbitMQ

App:
- HTTP Server
- RabbitMQ worker

## Project Structure

```
.
├── config -> Project configuration for parameters and DI services
│   └── packages
│       ├── orm
│       │   ├── readModel
│       │   └── writeModel
│       └── rabbitmq
├── doc
├── etc
│   ├── artifact --> Deployment artifact and orchestration
│   │   └── chart
│   │       ├── charts
│   │       ├── config
│   │       ├── dashboards
│   │       └── templates
│   │           └── tests
│   └── env --> Per env configuration
│       ├── dev
│       │   ├── kibana
│       │   └── postgres
│       └── minikube
├── src
│   ├── Application
│   │   ├── Middlewares
│   │   └── UseCase
│   │       └── Transaction
│   │           ├── Create
│   │           └── GetOne
│   ├── Domain
│   │   ├── Shared
│   │   │   ├── Exceptions
│   │   │   └── ValueObject
│   │   └── Transaction
│   │       ├── Events
│   │       └── ValueObject
│   ├── Infrastructure
│   │   ├── Shared
│   │   │   ├── Audit
│   │   │   ├── EventListener
│   │   │   ├── EventStore
│   │   │   │   └── Mapping
│   │   │   ├── Postgres
│   │   │   │   ├── ReadModel
│   │   │   │   │   └── Migrations
│   │   │   │   └── WriteModel
│   │   │   │       └── Migrations
│   │   │   └── Rabbitmq
│   │   └── Transaction
│   │       └── ReadModel
│   │           ├── Mapping
│   │           ├── Projections
│   │           └── Repository
│   └── UI
│       ├── Consumers
│       │   └── AsyncEventBus
│       └── HTTP
│           ├── Middleware
│           └── Routing
│               ├── Monitor
│               └── Transaction
└── tests
    ├── Application
    │   ├── Middlewares
    │   └── UseCase
    │       └── Transaction
    ├── Domain
    │   └── Transaction
    │       └── ValueObject
    ├── Infrastructure
    │   ├── Shared
    │   └── Transaction
    └── UI
        └── HTTP
            └── Transaction

```
