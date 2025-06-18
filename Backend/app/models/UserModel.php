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
    public function register($name, $email, $phone, $role, $password, $avatar)
    {
        try {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $sql = "INSERT INTO users (name, email, password, phone , role, avatar) VALUES (:name, :email, :password,:phone ,:role ,:avatar)";
            $stmt = $this->conn->prepare($sql);

            return $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $hashedPassword,
                ':phone' => $phone,
                ':role' => $role,
                ':avatar' => $avatar
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
                if ($user['role'] === "admin") {
                    // Return a specific error for admin login attempts
                    return ['error' => 'Admin login is not allowed.'];
                }
                if ($user['role'] === "buyer") {
                    $storedPassword = $user['password'];
                    if (strpos($storedPassword, '$2y$') === 0) {
                        if (password_verify($password, $storedPassword)) {
                            return $user;
                        }
                    } else {
                        if ($storedPassword === $password) {
                            $hashed = password_hash($password, PASSWORD_BCRYPT);
                            $update = $this->conn->prepare("UPDATE users SET password = :password WHERE id = :id");
                            $update->execute([':password' => $hashed, ':id' => $user['id']]);
                            $user['password'] = $hashed;
                            return $user;
                        }
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


    //   Admin login Model
    public function AdminLoginModel($email, $password)
    {
        try {
            $sql = "SELECT * FROM users WHERE email = :email AND role = 'admin'";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Successful admin login
                return $user;
            }
            // Invalid credentials or not an admin
            return false;
        } catch (PDOException $e) {
            // Log or handle error as needed
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
            if (isset($data['avatar'])) {
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



    //  Update password by ID
    public function updatePasswordById($id, $newPassword)
    {
        $query = "UPDATE users SET password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':password' => $newPassword, ':id' => $id]);
    }

    public function getUserIdByEmail($email)
    {
        $sql = "SELECT id FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['id'] : null;
    }


//  Reset password by email
    public function resetPasswordByEmail($email, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $query = "UPDATE users SET password = :password WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':password' => $hashedPassword, ':email' => $email]);
    }	
}
