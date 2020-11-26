# votenger

Voting application for Lan party.

## development

```bash
cp .env.example .env

make install dev
```

## testing

Make sure user `admin` is configured (`NEXT_PUBLIC_ADMINS`)

To run interactive mode make sure you added access control for X.
To disable access controll type `xhost +`

```bash
make test
make test--watch

make test-e2e
make test-e2e--interactive
```

## production

```bash
cp .env.example .env

sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env

make install build prod
```
