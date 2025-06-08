<?php
require_once __DIR__ . "../../models/UserModel.php";
require "../../config/database.php";
header("Content-Type: application/json");
class UserController
{
    private $userModel;
    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->userModel = new User($db);
    }
    //  Register controller
    public function register($data){
        // Check if JSON decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(["message" => "Invalid JSON input."]);
            return;
        }

        // Validate required fields
        if (empty($data['email']) || empty($data['role']) || empty($data['phone']) || empty($data['name']) || empty($data['password'])) {
            echo json_encode(["message" => "Missing required fields."]);
            return;  // Stop further execution
        }

        $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
        if (!$email) {
            echo json_encode(["message" => "Invalid email format."]);
            return;
        }

        $password = $data['password'];
        $role = $data['role'];
        $phone = $data['phone'];
        $name = $data['name'];
        $result = $this->userModel->register($name, $email, $phone, $role, $password);
        // Call the model to register the user
        if ($result === true) {
            echo json_encode(["message" => "User registered successfully!"]);
        } else {
            echo json_encode(["message" => "Error registering user."]);
        }
    }

    //  Login controller
    public function login($email, $password){
        return $this->userModel->login($email, $password);
    }
    
    public function logout(){
        session_start();
        session_destroy();
        echo "Logget is Successfuly ! ";
    }

    //  method getUser by role 
    function getUserbyRole($role){
        header("Content-Type: application/json");
        $users = $this->userModel->getUserByRole($role);
        echo json_encode($users, JSON_PRETTY_PRINT);
    }
    //  get all user
    function getAllUser(){
        header("Content-Type: application/json");
        $users = $this->userModel->getAllUsers();
        echo json_encode($users, JSON_PRETTY_PRINT);
    }

    //  Update user by ID 
    public function updateUser($id, $data){
    
        if (empty($data['name']) || empty($data['email']) || empty($data['role']) || empty($data['password']) || empty($data['phone'])) {
            
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }
        $result = $this->userModel->updateUserByID($id, $data);
        if ($result) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["message" => "Error updating user"]);
        }

        
    }

    // Send message from user to admin
    public function sendMessageToAdmin($data)
    {
        if (
            empty($data['email']) ||
            empty($data['contact_message']) ||
            empty($data['name']) ||
            empty($data['phone']) ||
            empty($data['subject'])
        ) {
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }
        $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
        if (!$email) {
            echo json_encode(["message" => "Invalid email format."]);
            return;
        }
        $result = $this->userModel->sendEmailToAdmin(
            $email,
            $data['contact_message'],
            $data['subject'],
            $data['name'],
            $data['phone']
        );
        if ($result) {
            echo json_encode(["message" => "Message sent successfully."]);
        } else {
            echo json_encode(["message" => "Failed to send message."]);
        }
    }

// Request password reset (send reset email)
public function forgotPasswordRequest($data)
{
    if (empty($data['email'])) {
        echo json_encode(["message" => "Email is required."]);
        return;
    }
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        echo json_encode(["message" => "Invalid email format."]);
        return;
    }
    // Check if user exists (optional, for better UX)
    $user = $this->userModel->getUserByEmail($email) ;// Or create a getUserByEmail method
    if (!$user) {
        echo json_encode(["message" => "No user found with this email."]);
        return;
    }
    $token = $this->userModel->generateResetToken($email);
    $result = $this->userModel->sendResetEmail($email, $token);
    if ($result === true) {
        echo json_encode(["message" => "Password reset email sent."]);
    } else {
        echo json_encode(["message" => "Failed to send reset email.", "error" => $result]);
    }
}

// Reset password using token
public function resetPassword($data)
{
    if (empty($data['token']) || empty($data['new_password'])) {
        echo json_encode(["message" => "Token and new password are required."]);
        return;
    }
    $user = $this->userModel->verifyResetToken($data['token']);
    if (!$user) {
        echo json_encode(["message" => "Invalid or expired token."]);
        return;
    }
    $result = $this->userModel->resetPassword($user['email'], $data['new_password']);
    if ($result) {
        echo json_encode(["message" => "Password has been reset successfully."]);
    } else {
        echo json_encode(["message" => "Failed to reset password."]);
    }
}

  

public function sendVerificationEmail($data)
{
    if (empty($data['email'])) {
        echo json_encode(["message" => "Email is required."]);
        return;
    }
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        echo json_encode(["message" => "Invalid email format."]);
        return;
    }
    $user = $this->userModel->getUserByEmail($email);
    if (!$user) {
        echo json_encode(["message" => "No user found with this email."]);
        return;
    }
    // Generate a verification token
    $token = bin2hex(random_bytes(32));
    $this->userModel->setVerifyToken($email, $token);

    // Send verification email
    $verificationLink = "http://localhost:3001/verify-email?token=$token"; // Update with your frontend URL
    $subject = "Verify Your Email";
    $body = "Please verify your email by clicking this link: $verificationLink";
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['GMAIL_USER'];
        $mail->Password   = $_ENV['GMAIL_APP_PASSWORD'];
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->setFrom($_ENV['GMAIL_USER'], 'Your App Name');
        $mail->addAddress($email);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->isHTML(false);
        $mail->send();
        echo json_encode(["message" => "Verification email sent."]);
    } catch (\Exception $e) {
        echo json_encode([
            "message" => "Failed to send verification email.",
            "error" => $mail->ErrorInfo // This will help you debug!
        ]);
    }
}

}
