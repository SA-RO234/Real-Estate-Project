<?php
class PasswordResetModel
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function createResetToken($userId, $token, $expires)
    {
        $query = "INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':user_id' => $userId,
            ':token' => $token,
            ':expires' => $expires
        ]);
    }

    public function getResetByToken($token)
    {
        $query = "SELECT * FROM password_resets WHERE token = :token AND expires_at > NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':token' => $token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function deleteResetToken($token)
    {
        $query = "DELETE FROM password_resets WHERE token = :token";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':token' => $token]);
    }
}
