include .env

USERID=$(shell id -u)
NODE_IMAGE=node:14

DOCKER_RUN = docker run \
	--volume ${PWD}:/app \
	--workdir /app \
	--user ${USERID} \
	--tty \
	--interactive \
	--rm

DOCKER_RUN_NODE = $(DOCKER_RUN) \
	--publish ${PORT}:${PORT} \
	${NODE_IMAGE}

build: ## build for production
	$(DOCKER_RUN) ${NODE_IMAGE} yarn build

dev: ## start development
	$(DOCKER_RUN_NODE) yarn dev

test: ## run tests
	$(DOCKER_RUN) ${NODE_IMAGE} yarn test

test--watch: ## run tests in watch mode
	$(DOCKER_RUN) ${NODE_IMAGE} yarn test:watch

install: ## install dependencies
	$(DOCKER_RUN) ${NODE_IMAGE} yarn install

prod: ## start production
	$(DOCKER_RUN_NODE) yarn start

lint: ## run linter
	$(DOCKER_RUN) ${NODE_IMAGE} yarn lint
