<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Always resolve the .env path relative to the project root
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad(); // Use safeLoad to avoid fatal error if .env is missing

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        $this->host = $_ENV['DB_HOST'] ?? null;
        $this->db_name = $_ENV['DB_DATABASE'] ?? null;
        $this->username = $_ENV['DB_USERNAME'] ?? null;
        $this->password = $_ENV['DB_PASSWORD'] ?? null;
    }

    public function getConnection(){
        $this->conn = null;
        try {
            // Trim env variables to avoid hidden spaces/newlines
            $host = trim($this->host);
            $db_name = trim($this->db_name);
            $username = trim($this->username);
            $password = trim($this->password);
            $port = trim($_ENV['DB_PORT'] ?? '5432');
            $dsn = "pgsql:host=$host;port=$port;dbname=$db_name;sslmode=require";
            $this->conn = new PDO($dsn, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            echo "❌ Database connection error: " . $exception->getMessage();
            throw new Exception("Failed to connect to the database: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
