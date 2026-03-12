@echo off
echo Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Vite cache cleared.
) else (
    echo No Vite cache found.
)

echo.
echo Starting dev server...
echo Press Ctrl+C to stop the server
echo.
npm run dev
