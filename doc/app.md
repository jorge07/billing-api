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
    console/      -> Queue workers od CLI commands 
    http/         -> HTTP Server
  Kernel.ts       -> Project Kernel
tests/            -> Tests directory
```
