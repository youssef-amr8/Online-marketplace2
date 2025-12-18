@echo off
echo Setting up port configuration...
echo.

echo Creating .env file for Buyer App...
echo PORT=3001 > frontend\buyer-app\.env
echo REACT_APP_API_URL=http://localhost:3000/api >> frontend\buyer-app\.env
echo.

echo Creating .env file for Seller App...
echo VITE_API_URL=http://localhost:3000/api > frontend\seller-app\.env
echo.

echo Port configuration complete!
echo.
echo Buyer App will run on: http://localhost:3001
echo Seller App will run on: http://localhost:5175
echo Backend should run on: http://localhost:3000
echo.
pause

