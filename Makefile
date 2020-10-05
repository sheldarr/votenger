include .env

.PHONY: help build

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
USERID=$(shell id -u)

DOCKER_RUN = docker run \
	--volume ${PWD}:/app \
	--workdir /app \
	--user ${USERID} \
	--publish ${PORT}:${PORT} \
	--tty \
	--interactive \
	--rm \
	node:12

build: ## build for production
	$(DOCKER_RUN) yarn build

dev: ## start development
	$(DOCKER_RUN) yarn dev -p ${PORT}

install: ## stop all services	
	$(DOCKER_RUN) yarn install

prod: ## start production
	$(DOCKER_RUN) yarn start -p ${PORT}

lint:
	$(DOCKER_RUN) yarn lint
