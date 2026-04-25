import mysql from 'mysql2/promise';
import 'dotenv/config';
import { exec } from 'child_process';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
  });

  try {
    console.log('Creating database hvc_ambassadors...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS hvc_ambassadors');
    console.log('Database hvc_ambassadors created successfully!');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await connection.end();
  }
}

createDatabase().then(() => {
  console.log('Database initialization completed. Now running prisma db push...');
  
  exec('npx prisma db push', (error, stdout, stderr) => {
    if (error) {
      console.error('Error running prisma db push:', error);
      return;
    }
    console.log('Prisma db push output:', stdout);
    if (stderr) {
      console.error('Prisma db push stderr:', stderr);
    }
  });
}).catch(console.error);
