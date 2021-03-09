include .env

USERID=$(shell id -u)
CYPRESS_IMAGE=cypress/included:6.0.0
NODE_IMAGE=node:14-alpine

DOCKER_RUN = docker run \
	--volume ${PWD}:/app \
	--workdir /app \
	--user ${USERID} \
	--env-file .env \
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

test-e2e:
	docker run -it --ipc=host -v ${PWD}/e2e:/app/e2e --net=host -v ${PWD}/db.json:/app/e2e/db.json -v ${PWD}/node_modules:/app/e2e/node_modules -e CYPRESS_BASE_URL=http://localhost:${PORT} -w /app/e2e --entrypoint=cypress ${CYPRESS_IMAGE} run

test-e2e--interactive:
	docker run -it --ipc=host -v ${PWD}/e2e:/app/e2e --net=host -v ${PWD}/db.json:/app/e2e/db.json -v ${PWD}/node_modules:/app/e2e/node_modules -e CYPRESS_BASE_URL=http://localhost:${PORT} -v /tmp/.X11-unix:/tmp/.X11-unix -w /app/e2e -e DISPLAY --entrypoint cypress ${CYPRESS_IMAGE} open --project .

install: ## install dependencies
	$(DOCKER_RUN) ${NODE_IMAGE} yarn install

prod: ## start production
	$(DOCKER_RUN_NODE) yarn start

lint: ## run linter
	$(DOCKER_RUN) ${NODE_IMAGE} yarn lint
