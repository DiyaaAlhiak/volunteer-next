const mysql = require('mysql2/promise');

async function testDatabaseColumns() {
  console.log('Testing database columns...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'hvc_ambassadors'
    });
    
    console.log('Connected to database successfully!');
    
    // Check if teams table exists and get its columns
    const [columns] = await connection.execute('DESCRIBE teams');
    console.log('\nTeams table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    await connection.end();
    console.log('\nDatabase column verification completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDatabaseColumns();
