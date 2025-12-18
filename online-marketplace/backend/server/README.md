# Marketplace Backend

## Setup
1. copy `.env.example` to `.env` and fill variables
2. `npm install`
3. `npm run dev` to start in development (nodemon)

## Seed data
`npm run seed`

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/items
- POST /api/items (auth)
- POST /api/orders (auth)
- PATCH /api/orders/:id/status (auth)
- POST /api/comments (auth)
- POST /api/flags (auth)
- GET /api/categories
