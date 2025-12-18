#!/bin/bash

echo "Setting up port configuration..."
echo

echo "Creating .env file for Buyer App..."
cat > frontend/buyer-app/.env << EOF
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
EOF

echo "Creating .env file for Seller App..."
cat > frontend/seller-app/.env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

echo
echo "Port configuration complete!"
echo
echo "Buyer App will run on: http://localhost:3001"
echo "Seller App will run on: http://localhost:5175"
echo "Backend should run on: http://localhost:3000"
echo

