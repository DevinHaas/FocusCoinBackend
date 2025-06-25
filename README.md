# FocusCoin Backend

## Getting Started
To kickstart your development journey, install Bun locally using the following command:

```bash
curl https://bun.sh/install | bash
```

## Database
Set up a PostgreSQL database in a Docker container with the following command:

```bash
docker run --name focuscoin-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=focuscoindb -d -p 5432:5432 postgres
```

### Migrations
Apply changes to the schema by running a new migration with Prisma:

```bash
bunx prisma migrate dev
```

## Development
Initiate the development server with:

```bash
bun run dev
```

### Environment variables
Ensure your `.env` file includes the following variables:

```bash
WEBHOOK_SECRET=
CLERK_PUBLISHABLE_KEY=pk_
CLERK_SECRET_KEY=sk_
DATABASE_URL="postgresql://user:password@localhost:5432/focuscoindb"
```

Remember to modify the username and password in the Docker container creation process.

Retrieve the Clerk keys [here](https://dashboard.clerk.com/last-active?path=api-keys).

### Sync users to db
Sync users from Clerk to the local database by adding the WEBHOOK_SECRET to your `.env.local` file. Find the secret [here](https://dashboard.clerk.com/) under webhooks.

The sync functionality uses webhooks, so for local development, set up a proxy endpoint using [ngrok](https://ngrok.com):

1. Create an account on ngrok.
2. Follow the guide to set up your local machine.
3. Launch the endpoint.
4. Create a new endpoint in [Clerk](https://dashboard.clerk.com/) with the launched endpoint.
5. Now you're ready to go!

### Making requests
For development purposes, comment out the following code in the endpoints to disable Clerk authentication:

```bash
// @ts-ignore
if (!store.auth?.userId) {
    set.status = 403
    return 'Unauthorized'
}
```

Visit http://localhost:3000/ in your browser to see the result.