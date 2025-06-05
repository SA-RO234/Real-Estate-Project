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

    public function __construct(){
        $this->host = $_ENV['DB_HOST'] ?? null;
        $this->db_name = $_ENV['DB_DATABASE'] ?? null;
        $this->username = $_ENV['DB_USERNAME'] ?? null;
        $this->password = $_ENV['DB_PASSWORD'] ?? null;
    }

    public function getConnection(){
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw new Exception("Failed to connect to the database: " . $exception->getMessage());
        }

        return $this->conn;
    }
}