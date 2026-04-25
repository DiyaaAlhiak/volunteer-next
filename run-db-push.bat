@echo off
set DATABASE_URL=mysql://root:@localhost:3306/hvc_ambassadors
echo DATABASE_URL: %DATABASE_URL%
npx prisma db push
