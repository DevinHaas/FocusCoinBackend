# FocusCoin Backend

## Getting Started
Install Bun locally:
```bash
curl https://bun.sh/install | bash
```

## Database
Spin up a postgresql database in docker:
```bash
docker run --name focuscoin-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=focuscoindb -d -p 5432:5432 postgres
```

### Migrations
To apply changes in schema.prisma you need to run a new migration with prisma:
```bash
bunx prisma migrate dev
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.