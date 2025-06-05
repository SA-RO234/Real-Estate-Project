<?php

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct(){
        $this->host = "localhost"; 
        $this->db_name = "real_estatedb"; 
        $this->username = "root"; // Set your DB username here
        $this->password = "yeayyeab2"; // Set your DB password here
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
