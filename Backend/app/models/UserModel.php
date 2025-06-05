<?php

class User{
    private $conn;
    public function __construct($database){
        $this->conn = $database;
    }

    //  get All users
    public function getAllUsers(){
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
    public function register($name, $email, $phone , $role, $password){
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
    public function login($email, $password) {
        try {
            $sql = "SELECT * FROM users WHERE email = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Check if user exists and verify the password
            if ($user && password_verify($password, $user['password'])) {
                return $user; // Return user data to the controller
            }
    
            // Return false if login fails
            return false;
        } catch (PDOException $e) {
            // Log the error or handle it appropriately
            return false;
        }
    }

    // Logout User
    public function logout(){
        session_start();
        session_destroy();
    }

    //  update model
    public function updateUserByID($id, $data){
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
    function DeleteUser($id){
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bindParam("i",$id);
        $stmt->execute();
    }


    // Send email to admin (simple version)
    public function sendEmailToAdmin($fromEmail, $messageBody, $subject = '', $name = '', $phone = '')
    {
        $adminEmail = "rozasun61@gmail.com"; // Change to your admin Gmail
        $fullSubject = $subject ? "Contact: $subject" : "New message from user";
        $body = "Name: $name\nEmail: $fromEmail\nPhone: $phone\n\nMessage:\n$messageBody";
        $headers = "From: " . $fromEmail . "\r\n" .
            "Reply-To: " . $fromEmail . "\r\n" .
            "Content-Type: text/plain; charset=UTF-8\r\n";
        return mail($adminEmail, $fullSubject, $body, $headers);
    }
}

