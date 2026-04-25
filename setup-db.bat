@echo off
echo Setting up database...
set DATABASE_URL=mysql://root:@localhost:3306/hvc_ambassadors
echo DATABASE_URL set to: %DATABASE_URL%
echo Running prisma db push...
npx prisma db push
echo Database setup completed!
pause
