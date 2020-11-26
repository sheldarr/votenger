# votenger

Voting application for Lan party.

## development

```bash
cp .env.example .env

make install dev
```

## testing

```bash
make test
make test--watch

make test-e2e

# make sure you added access control for X
# to disable access controll type 'xhost +'
make test-e2e--interactive
```

## production

```bash
cp .env.example .env

sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env

make install build prod
```
