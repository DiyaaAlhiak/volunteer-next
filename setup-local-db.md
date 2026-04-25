# Setting Up Local MySQL Database

## Step 1: Install MySQL

### Option A: Using XAMPP (Recommended for Windows)
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL services from XAMPP Control Panel
4. MySQL will be available at localhost:3306 with user: root, password: (empty)

### Option B: Using MySQL Installer
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember your root password during installation

## Step 2: Create Database
```sql
CREATE DATABASE hvc_ambassadors;
```

## Step 3: Update .env.local
Change your DATABASE_URL to:
```
DATABASE_URL="mysql://root:@localhost:3306/hvc_ambassadors"
```
(If you set a password for MySQL root user, use: `mysql://root:your_password@localhost:3306/hvc_ambassadors`)

## Step 4: Import Data
You'll need to export the data from the old project first. You can do this by:

1. **If you have access to the old database server:**
   ```bash
   mysqldump -h pioneerseg.ddns.net -u root -pAlgo@5055 hvc_ambassadors > hvc_ambassadors_backup.sql
   ```

2. **Import to local database:**
   ```bash
   mysql -u root -p hvc_ambassadors < hvc_ambassadors_backup.sql
   ```

## Step 5: Test Connection
Run: `node test-connection.js`

## Alternative: Create Sample Data
If you can't export from the old database, I can help you create sample data with the real members (Ziad, Abdallah, etc.) based on what you know about them.
