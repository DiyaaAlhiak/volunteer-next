const mysql = require('mysql2/promise');

async function checkDatabaseColumns() {
  console.log('Checking actual database column names...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'hvc_ambassadors'
    });
    
    console.log('Connected to database successfully!');
    
    // Check the actual column names in the teams table
    const [columns] = await connection.execute('DESCRIBE teams');
    console.log('\nActual teams table columns in database:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    await connection.end();
    console.log('\nDatabase column check completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabaseColumns();
