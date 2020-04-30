.PHONY: dev artifact mk-template mk-deploy prom-crds mk-start mk-setup mk-expose-api mk-expose-grafana mk-expose-prom
ENV=dev
COMPOSE=docker-compose -f docker-compose.yml -f docker-compose.$(env).yml
APP_VERSION=1.0.0
CRD_URL=https://raw.githubusercontent.com/coreos/prometheus-operator/release-0.37/example/prometheus-operator-crd/monitoring.coreos.com_

export ENV COMPOSE APP_VERSION CRD_URL

dev:
	yarn dev

artifact: ## build environment and initialize composer and project dependencies
	@eval $$(minikube docker-env); \
	docker build -t jorge07/billing-api:${APP_VERSION} -f etc/artifact/Dockerfile .

mk-template:
	helm template api --namespace default -f etc/env/minikube/values.yaml -f etc/env/minikube/grafana.yaml etc/artifact/chart/

mk-deploy:
	helm upgrade -i api --namespace default -f etc/env/minikube/values.yaml -f etc/env/minikube/grafana.yaml etc/artifact/chart/

prom-crds:
	kubectl apply -f $(CRD_URL)alertmanagers.yaml
	kubectl apply -f $(CRD_URL)podmonitors.yaml
	kubectl apply -f $(CRD_URL)prometheuses.yaml
	kubectl apply -f $(CRD_URL)prometheusrules.yaml
	kubectl apply -f $(CRD_URL)servicemonitors.yaml
	kubectl apply -f $(CRD_URL)thanosrulers.yaml

mk-start:
	minikube start

mk-setup: mk-start prom-crds mk-template mk-deploy

mk-expose-api:
	echo "open http://127.0.0.1:8070"
	kubectl --namespace default port-forward svc/api-billing 8070:80

mk-expose-prom:
	echo "open http://127.0.0.1:9090"
	kubectl --namespace default port-forward svc/api-prometheus-operator-prometheus 9090:9090

mk-expose-grafana:
	echo "open http://127.0.0.1:3000"
	echo "User admin"
	echo "Pass prom-operator"
	kubectl --namespace default port-forward svc/api-grafana 3000:80
