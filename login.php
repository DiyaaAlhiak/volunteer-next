<?php
/**
 * Login API Endpoint for Next.js Frontend
 * Place this file in your PHP project's /api/ directory
 * URL: https://YOUR_PHP_DOMAIN.com/api/login.php
 */

// CORS Headers for Next.js Communication
header("Access-Control-Allow-Origin: *"); // In production, replace * with your Next.js domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

// Get JSON input from Next.js
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

// Validate input
if (!$data || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request data'
    ]);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// Database Configuration - UPDATE THESE VALUES
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');

// Database Connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

// Prepare SQL to find user
$sql = "SELECT id, username, name, password_hash FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Success - Generate JWT token (simple implementation)
        $token = generateJWT($user);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'name' => $user['name']
                ]
            ]
        ]);
    } else {
        // Failed login
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database query failed'
    ]);
}

/**
 * Simple JWT Token Generation
 * In production, use a proper JWT library like firebase/php-jwt
 */
function generateJWT($user) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $user['id'],
        'username' => $user['username'],
        'exp' => time() + (60 * 60 * 24) // 24 hours expiration
    ]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'your-secret-key', true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/*
DATABASE SETUP SQL:

CREATE DATABASE IF NOT EXISTS your_database_name;
USE your_database_name;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test user (password: 123456)
INSERT INTO users (username, name, email, password_hash) 
VALUES (
    'admin', 
    'Administrator', 
    'admin@example.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- To create new users with hashed passwords:
-- password_hash('your_password', PASSWORD_DEFAULT)

USAGE INSTRUCTIONS:

1. Update the database constants at the top of this file
2. Place this file in: /your-php-project/api/login.php
3. Update CORS_ORIGIN to your Next.js domain in production
4. Test with: admin / 123456
5. For production, use a proper JWT library and HTTPS
*/
?>
