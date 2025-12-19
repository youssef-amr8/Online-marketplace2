# Team Setup Guide - Shared Database Environment

This guide explains how to set up the development environment using Docker and clarifies how the database is "shared" among teammates.

## 🚀 Getting Started

To ensure everyone has the same database structure and demo data, follow these steps:

1.  **Install Docker & Docker Desktop**: Make sure Docker is running on your machine.
2.  **Clone the Repository**: Ensure you have the latest code from the `shared-database` branch.
3.  **Start the Environment**:
    ```bash
    docker-compose up -d
    ```
    This command starts:
    -   A **MongoDB** instance (port 27017).
    -   An **Automatic Seeding** service that populates your database with demo products, a demo seller, and a demo buyer.

## 💡 How "Sharing" Works

> [!IMPORTANT]
> **Important Distinction: Shared Environment vs. Synced Data**
>
> -   **Shared Environment**: Docker ensures that every developer is running the exact same version of MongoDB and starts with the exact same **Demo Data** (products, categories, users).
> -   **Local Data**: Any *new* products you add while the app is running are stored in **your local Docker volume**. Your teammates will **not** see the products you manually add, and you will not see theirs. This is normal for local development to prevent developers from cluttering each other's workspaces.

## 🔄 How to Sync/Reset Data

If you want to reset your local database to match the demo data again (e.g., after a teammate updates the `seed.js` script with new categories):

1.  Stop the containers:
    ```bash
    docker-compose down
    ```
2.  Start them again:
    ```bash
    docker-compose up -d
    ```
    The `db-seed` service is configured to clear and re-populate the database every time the containers are started.

## 🛠️ Troubleshooting Connection

If your app cannot connect to the database:
-   Check if port `27017` is already being used by a local installation of MongoDB. If so, stop your local MongoDB service.
-   Run `docker ps` to ensure the `mongo` container is healthy.
-   Check the logs if seeding fails: `docker logs <container_id_for_db_seed>`.
