Write-Host "Setting up database..."

# Set environment variable
$env:DATABASE_URL = "mysql://root:@localhost:3306/hvc_ambassadors"
Write-Host "DATABASE_URL set to: $env:DATABASE_URL"

# Run prisma db push
Write-Host "Running npx prisma db push..."
npx prisma db push

Write-Host "Database setup completed!"
Read-Host "Press Enter to exit..."
