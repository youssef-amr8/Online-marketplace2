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

## 💡 How "Sharing" Works (Real Sync!)

> [!IMPORTANT]
> **Real-Time Syncing is Active!**
>
> We have migrated from local Docker databases to a **Shared Cloud Database (MongoDB Atlas)**.
> -   **Synced Data**: Any product added by *any* teammate in their local app will now appear for *everyone* instantly!
> -   **Cloud Connection**: Your app connects to the URI defined in `.env` or `docker-compose.yml`.

## 🔄 How to Setup/Reset

1.  **Configure Credentials**: Open your `.env` file (or `docker-compose.yml`) and ensure the `DB_URI` has the correct Atlas password.
2.  **Start/Restart**:
    ```bash
    docker-compose down
    docker-compose up -d
    ```

## 🛠️ Troubleshooting Connection

If your app cannot connect:
-   **Check Network Access**: In MongoDB Atlas, ensure IPs are allowed (usually set to `0.0.0.0/0` for dev).
-   **Password**: Ensure the password in the URI doesn't have `< >` symbols around it.
-   **Local Fallback**: If Atlas is down, you can change `DB_URI` back to `mongodb://mongo:27017/marketPlace` to use the local Docker database.
