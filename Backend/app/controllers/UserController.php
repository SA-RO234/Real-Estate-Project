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
    public function register($data)
    {
        // Check if JSON decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(["message" => "Invalid JSON input."]);
            return;
        }

        // Validate required fields
        if (empty($data['email']) || empty($data['role']) || empty($data['phone']) || empty($data['name']) || empty($data['password']) || empty($data['avatar'])) {
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
        $avatar = $data['avatar'];
        $result = $this->userModel->register($name, $email, $phone, $role, $password,$avatar);
        // Call the model to register the user
        if ($result === true) {
            echo json_encode(["message" => "User registered successfully!"]);
        } else {
            echo json_encode(["message" => "Error registering user."]);
        }
    }

    //  Login controller
    public function login($email, $password)
    {
        $result = $this->userModel->login($email, $password);
        if (!$result) {
            // Debug: log or print why login failed
            error_log("Login failed for $email with password $password");
        }
        return $result;
    }

    public function logout()
    {
        session_start();
        session_destroy();
        echo "Logget is Successfuly ! ";
    }

    //  method getUser by role 
    function getUserbyRole($role)
    {
        header("Content-Type: application/json");
        $users = $this->userModel->getUserByRole($role);
        echo json_encode($users, JSON_PRETTY_PRINT);
    }
    //  get all user
    function getAllUser()
    {
        header("Content-Type: application/json");
        $users = $this->userModel->getAllUsers();
        echo json_encode($users, JSON_PRETTY_PRINT);
    }

    //  Update user by ID 
    public function updateUser($id, $data)
    {

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





}
