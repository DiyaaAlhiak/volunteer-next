const mysql = require('mysql2/promise');

async function createDefaultSettings() {
  console.log('🔍 Manual Settings Creation Script');
  console.log('================================');
  
  try {
    // Parse DATABASE_URL from environment
    const dbUrl = process.env.DATABASE_URL;
    console.log('📡 DATABASE_URL:', dbUrl ? 'SET' : 'NOT SET');
    
    if (!dbUrl) {
      console.error('❌ DATABASE_URL is not set in environment variables');
      process.exit(1);
    }

    // Extract connection details from DATABASE_URL
    // Expected format: mysql://user:password@host:port/database
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    
    if (!match) {
      console.error('❌ Invalid DATABASE_URL format');
      console.log('Expected format: mysql://user:password@host:port/database');
      process.exit(1);
    }

    const [, user, password, host, port, database] = match;
    
    console.log('🔗 Connection Details:');
    console.log(`  Host: ${host}`);
    console.log(`  Port: ${port}`);
    console.log(`  Database: ${database}`);
    console.log(`  User: ${user}`);
    
    // Create connection
    const connection = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: user,
      password: password,
      database: database
    });

    console.log('✅ Database connected successfully');

    // Check if settings table exists and create default settings
    console.log('📋 Checking settings table...');
    
    try {
      // First, let's see if the table exists by trying to query it
      const [existingSettings] = await connection.execute(
        'SELECT * FROM Settings LIMIT 1'
      );
      
      if (existingSettings.length === 0) {
        console.log('📝 Creating default settings...');
        
        await connection.execute(
          `INSERT INTO Settings (allow_team_registration, allow_member_registration, created_at, updated_at) 
           VALUES (?, ?, NOW(), NOW())`,
          [true, true]
        );
        
        console.log('✅ Default settings created successfully!');
        console.log('📋 Settings:');
        console.log('  - allow_team_registration: true');
        console.log('  - allow_member_registration: true');
      } else {
        console.log('✅ Settings already exist:');
        console.log(`  - allow_team_registration: ${existingSettings[0].allow_team_registration}`);
        console.log(`  - allow_member_registration: ${existingSettings[0].allow_member_registration}`);
      }
      
    } catch (tableError) {
      if (tableError.code === 'ER_NO_SUCH_TABLE') {
        console.log('❌ Settings table does not exist. Please run: npx prisma db push');
      } else {
        console.error('❌ Error accessing settings table:', tableError.message);
      }
    }

    await connection.end();
    console.log('🎉 Manual settings script completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDefaultSettings();
