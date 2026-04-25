const mysql = require('mysql2/promise');

async function checkColumns() {
  console.log('=== CHECKING ACTUAL DATABASE COLUMNS ===');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'hvc_ambassadors'
    });
    
    console.log('Connected to database!');
    
    // Get actual column names
    const [columns] = await connection.execute('DESCRIBE teams');
    console.log('\nACTUAL COLUMNS IN teams TABLE:');
    columns.forEach(col => {
      console.log(`  "${col.Field}" - ${col.Type}`);
    });
    
    await connection.end();
    console.log('\n=== COLUMN CHECK COMPLETE ===');
    
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

checkColumns();
