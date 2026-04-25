console.log('Starting simple database test...');

const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Attempting to connect to MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'hvc_ambassadors'
    });
    
    console.log('Connected successfully!');
    
    console.log('Querying teams table structure...');
    const [rows] = await connection.execute('DESCRIBE teams');
    
    console.log('Teams table columns:');
    rows.forEach(row => {
      console.log(`  ${row.Field} - ${row.Type}`);
    });
    
    await connection.end();
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConnection();
