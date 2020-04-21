# Environments

### Development env

Main process runs outside docker, only dependencies run in containers.

- **Path**: `etc/envs/dev`
- **Setup**: `nvm install && yarn install`
- **Start**: `&& yarn dev`
- **Test**: `yarn test`
- **Lint**: `yarn lint`

### Minikube env

- **Path**: `etc/envs/minikube`
- **Setup**: `make mk-setup`
- **API**: `make mk-expose-api` Port 8070
- **Grafana**: `make mk-expose-grafana` Port 3000. Credentials in console
- **Prometheus**: `make mk-expose-prom` Port 9090
