# votenger

Voting application for Lan party.

## development

```bash
cp .env.example .env

make install dev
```

## production

```bash
cp .env.example .env

sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env

make install build prod
```
