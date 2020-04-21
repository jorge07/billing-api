ENV=dev
COMPOSE=docker-compose -f docker-compose.yml -f docker-compose.$(env).yml
MINIKUBE_DOCKER=minikube docker-env
APP_VERSION=1.0.0
CRD_URL=https://raw.githubusercontent.com/coreos/prometheus-operator/release-0.37/example/prometheus-operator-crd/monitoring.coreos.com_

export ENV COMPOSE MINIKUBE_DOCKER APP_VERSION CRD_URL

.PHONY: dev
dev: 
	yarn dev

.PHONY: artifact
artifact: ## build environment and initialize composer and project dependencies
	eval $(minikube -p minikube docker-env) 
	docker build -t jorge07/billing-api:${APP_VERSION} -f etc/artifact/Dockerfile .

.PHONY: mk-template
mk-template:
	helm template api --namespace default -f etc/env/minikube/values.yaml -f etc/env/minikube/grafana.yaml etc/artifact/chart/

.PHONY: mk-deploy
mk-deploy:
	helm upgrade -i api --namespace default -f etc/env/minikube/values.yaml -f etc/env/minikube/grafana.yaml etc/artifact/chart/

.PHONY: prom-crds
prom-crds:
	kubectl apply -f $(CRD_URL)alertmanagers.yaml
	kubectl apply -f $(CRD_URL)podmonitors.yaml
	kubectl apply -f $(CRD_URL)prometheuses.yaml
	kubectl apply -f $(CRD_URL)prometheusrules.yaml
	kubectl apply -f $(CRD_URL)servicemonitors.yaml
	kubectl apply -f $(CRD_URL)thanosrulers.yaml

.PHONY: mk-start
mk-start:
	minikube start

.PHONY: mk-setup
mk-setup: mk-start prom-crds mk-template mk-deploy

.PHONY: mk-expose-api
mk-expose-api:
	echo "open http://127.0.0.1:8070"
	kubectl --namespace default port-forward svc/api-billing 8070:80

.PHONY: mk-expose-prom
mk-expose-prom:
	echo "open http://127.0.0.1:9090"
	kubectl --namespace default port-forward svc/api-prometheus-operator-prometheus 9090:9090

.PHONY: mk-expose-grafana
mk-expose-grafana:
	echo "open http://127.0.0.1:3000"
	echo "User admin"
	echo "Pass prom-operator"
	kubectl --namespace default port-forward svc/api-grafana 3000:80
