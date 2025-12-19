# Sharing your Database with Docker

This project is configured to make it easy for teammates to get started with a fully populated database.

## Getting Started

To start the entire environment, including the database and the backend app, run:

```bash
docker-compose up -d
```

## How it works

1.  **MongoDB Service**: A standard MongoDB 7 container is started.
2.  **Persistent Data**: Database data is stored in a Docker volume named `mongo-data`. This means your data persists even if you stop the containers.
3.  **Automatic Seeding**: A service called `db-seed` runs automatically on startup. It connects to the database and populates it with:
    -   Demo Categories
    -   A Demo Seller (`demo@seller.com` / `demo123`)
    -   A Demo Buyer (`demo@buyer.com` / `demo123`)
    -   Demo Products (iphones, laptops, etc.)

## Re-seeding the Database

If you want to reset your database to the initial state, you can run:

```bash
docker-compose run db-seed
```

> [!WARNING]
> This will delete existing data in the `marketPlace` database and replace it with the demo data.

## Sharing with Others

When others pull your repository, they simply need to have Docker installed and run `docker-compose up -d`. They will automatically receive the same database structure and demo data you see.
