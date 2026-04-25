const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'pioneerseg.ddns.net',
  port: 3306,
  user: 'root',
  password: 'Algo@5055',
  database: 'hvc_ambassadors',
  timeout: 10000
});

console.log('Testing connection to pioneerseg.ddns.net:3306...');

connection.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.code, err.message);
    if (err.code === 'ETIMEDOUT') {
      console.log('Timeout: The server is not responding or port 3306 is closed');
      console.log('Possible causes:');
      console.log('1. Database server is down');
      console.log('2. Port 3306 is blocked by firewall');
      console.log('3. Your IP is not whitelisted');
    }
    process.exit(1);
  } else {
    console.log('Connected successfully!');
    
    connection.query('SELECT COUNT(*) as userCount FROM users', (err, results) => {
      if (err) {
        console.error('Query error:', err);
      } else {
        console.log('Total users in database:', results[0].userCount);
        
        // Get some sample users
        connection.query('SELECT name, email, username FROM users LIMIT 5', (err, users) => {
          if (err) {
            console.error('Error fetching users:', err);
          } else {
            console.log('Sample users:');
            users.forEach(user => {
              console.log(`- ${user.name} (${user.username}) - ${user.email}`);
            });
          }
          connection.end();
        });
      }
    });
  }
});
