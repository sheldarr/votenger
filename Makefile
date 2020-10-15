include .env

USERID=$(shell id -u)

DOCKER_RUN = docker run \
	--volume ${PWD}:/app \
	--workdir /app \
	--user ${USERID} \
	--publish ${PORT}:${PORT} \
	--tty \
	--interactive \
	--rm \
	node:14-alpine

build: ## build for production
	$(DOCKER_RUN) yarn build

dev: ## start development
	$(DOCKER_RUN) yarn dev

test: ## run tests
	$(DOCKER_RUN) yarn test

test--watch: ## run tests in watch mode
	$(DOCKER_RUN) yarn test:watch

install: ## install dependencies
	$(DOCKER_RUN) yarn install

prod: ## start production
	$(DOCKER_RUN) yarn start

lint: ## run linter
	$(DOCKER_RUN) yarn lint
