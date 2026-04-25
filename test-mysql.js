const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing MySQL connection...');
  
  try {
    // Connect to MySQL server without specifying database
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('Successfully connected to MySQL server!');
    
    // Create database if it doesn't exist
    console.log('Creating database hvc_ambassadors...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS hvc_ambassadors');
    console.log('Database hvc_ambassadors created or already exists!');
    
    // Show databases
    const [rows] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:');
    rows.forEach(row => console.log('- ' + row.Database));
    
    await connection.end();
    console.log('Connection closed.');
    
    // Now run prisma db push
    console.log('Running npx prisma db push...');
    const { exec } = require('child_process');
    exec('npx prisma db push', { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error running prisma db push:', error);
        return;
      }
      console.log('Prisma db push completed!');
      console.log('Output:', stdout);
      if (stderr) console.log('Stderr:', stderr);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Make sure MySQL is running on localhost:3306 with user root and no password');
  }
}

testConnection();
