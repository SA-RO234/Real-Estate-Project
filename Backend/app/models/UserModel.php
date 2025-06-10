<?php
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class User
{
    private $conn;
    public function __construct($database)
    {
        $this->conn = $database;
    }

    //  get All users
    public function getAllUsers()
    {
        $sql = "SELECT * FROM users";
        $result = $this->conn->query($sql);
        return $result->fetchAll(PDO::FETCH_ASSOC);
    }

    //    get users by ID 
    public function getUserByRole($role)
    {
        $sql = "SELECT * FROM users WHERE role = :role";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":role", $role);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Register  user model
    public function register($name, $email, $phone, $role, $password)
    {
        try {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $sql = "INSERT INTO users (name, email, password, phone , role) VALUES (:name, :email, :password,:phone ,:role)";
            $stmt = $this->conn->prepare($sql);

            return $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $hashedPassword,
                ':phone' => $phone,
                ':role' => $role
            ]);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    //  Login method
    public function login($email, $password)
    {
        try {
            $sql = "SELECT * FROM users WHERE email = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $storedPassword = $user['password'];
                // If already hashed, use password_verify
                if (strpos($storedPassword, '$2y$') === 0) {
                    if (password_verify($password, $storedPassword)) {
                        return $user;
                    }
                } else {
                    // If plain text and matches, hash it and update in DB
                    if ($storedPassword === $password) {
                        $hashed = password_hash($password, PASSWORD_BCRYPT);
                        $update = $this->conn->prepare("UPDATE users SET password = :password WHERE id = :id");
                        $update->execute([':password' => $hashed, ':id' => $user['id']]);
                        // Update user array to reflect new hash
                        $user['password'] = $hashed;
                        return $user;
                    }
                }
            }
            // Return false if login fails
            return false;
        } catch (PDOException $e) {
            // Log the error or handle it appropriately
            return false;
        }
    }

    // Logout User
    public function logout()
    {
        session_start();
        session_destroy();
    }

    //  update model
    public function updateUserByID($id, $data)
    {
        try {
            $fields = [];
            $params = [];
            if (isset($data['name'])) {
                $fields[] = "name = :name";
                $params[':name'] = $data['name'];
            }
            if (isset($data['email'])) {
                $fields[] = "email = :email";
                $params[':email'] = $data['email'];
            }
            if (isset($data['role'])) {
                $fields[] = "role = :role";
                $params[':role'] = $data['role'];
            }
            if (isset($data['phone'])) {
                $fields[] = "phone = :phone";
                $params[':phone'] = $data['phone'];
            }
            if (isset($data['password'])) {
                $fields[] = "password = :password";
                $params[':password'] = password_hash($data['password'], PASSWORD_BCRYPT);
            }
            if(isset($data['avatar'])){
                $fields[] = "avatar = :avatar";
                $params[':avatar'] = $data['avatar'];
            }
            if (empty($fields)) return false;
            $params[':id'] = $id;
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            return false;
        }
    }

    //  Delete model
    function DeleteUser($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bindParam(1, $id, PDO::PARAM_INT);
        $stmt->execute();
    }


    // Get user by email (no password check)
    public function getUserByEmail($email)
    {
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }



    // Send email to admin (simple version)
    public function sendEmailToAdmin($fromEmail, $messageBody, $subject = '', $name = '', $phone = '')
    {
        $adminEmail = "rozasun61@gmail.com"; // Admin Gmail
        $fullSubject = $subject ? "Contact: $subject" : "New message from user";
        $body = "Name: $name\nEmail: $fromEmail\nPhone: $phone\n\nMessage:\n$messageBody";

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['GMAIL_USER'];
            $mail->Password   = $_ENV['GMAIL_APP_PASSWORD'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom($mail->Username, $name); // Use your Gmail as sender
            $mail->addReplyTo($fromEmail, $name);   // User's email as reply-to
            $mail->addAddress($adminEmail);

            $mail->Subject = $fullSubject;
            $mail->Body    = $body;
            $mail->isHTML(false);

            $mail->send();

            return true;
        } catch (Exception $e) {
            // For debugging, return error info
            return $mail->ErrorInfo;
        }
    }



    // Generate a password reset token
    public function generateResetToken($email)
    {
        $token = bin2hex(random_bytes(50)); // Generate a random token
        $sql = "UPDATE users SET reset_token = :token, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':token' => $token, ':email' => $email]);
        return $token;
    }

    // Send password reset email
    public function sendResetEmail($email, $token)
    {
        $resetLink = "http://localhost:3000/?token=$token"; // Update with your domain
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['GMAIL_USER'];
            $mail->Password   = $_ENV['GMAIL_APP_PASSWORD'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom($_ENV['GMAIL_USER'], 'Your App Name');
            $mail->addAddress($email);
            $mail->Subject = 'Password Reset Request';
            $mail->Body    = "To reset your password, please click the following link: $resetLink";
            $mail->isHTML(false);

            $mail->send();
            return true;
        } catch (Exception $e) {
            return $mail->ErrorInfo;
        }
    }

    // Verify the reset token
    public function verifyResetToken($token)
    {
        $sql = "SELECT * FROM users WHERE reset_token = :token AND token_expiry > NOW()";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':token' => $token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Reset the password
    public function resetPassword($email, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $sql = "UPDATE users SET password = :password, reset_token = NULL, token_expiry = NULL WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([':password' => $hashedPassword, ':email' => $email]);
    }

    public function setVerifyToken($email, $token)
    {
        $sql = "UPDATE users SET verify_token = :token WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([':token' => $token, ':email' => $email]);
    }

}
