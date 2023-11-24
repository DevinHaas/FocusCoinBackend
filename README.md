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

### Environment variables
Add the following variables to your .env file:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/focuscoindb"
CLERK_PUBLISHABLE_KEY=pk_
CLERK_SECRET_KEY=sk_
```
The clerk keys can be found [here](https://dashboard.clerk.com/last-active?path=api-keys).

Open http://localhost:3000/ with your browser to see the result.

### Making requests
For development purposes comment out the following code in the endpoints to disable clerk authentication:
```bash
// @ts-ignore
if (!store.auth?.userId) {
    set.status = 403
    return 'Unauthorized'
}
```