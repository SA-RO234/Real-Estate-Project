<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Fixed header (correct name and removed spaces)
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad();

require "../controllers/UserController.php";
require_once "../core/Session.php";

$usersController = new UserController();

$method = $_SERVER['REQUEST_METHOD'];
$url = $_SERVER['REQUEST_URI'];

$routes = [
    "GET" => function () use ($usersController) {
        if (isset($_GET['role'])) {
            $usersController->getUserByRole($_GET['role']);
        } else {
            $usersController->getAllUser();
        }
    },
    "POST" => function () use ($usersController) {
        $input = json_decode(file_get_contents("php://input"), true);
        // Check if the request is for registration (requires name, phone, role)
        if (isset($input['name']) && isset($input["email"]) && isset($input['phone']) && isset($input["password"]) && isset($input['role'])) {
            $usersController->register($input);
        }
        // Otherwise, treat it as a login request (requires email and password)
        elseif (isset($input['email']) && isset($input['password'])) {
            Session::Start();
            $user =  $usersController->login($input['email'], $input['password']);
            if ($user && isset($user['error'])) {
                // Send specific error message (e.g., admin login not allowed)
                echo json_encode(['message' => $user['error']]);

            }elseif($user){
                Session::set('user_id', $user['id']);
                Session::set('email', $user['email']);
                //  Send session to fron-end 
                echo json_encode([
                    'message' => "Login Successfuly",
                    'session_id' => session_id(), // Send session ID
                    'user' => $user

                ]);
            } else {

                echo json_encode(['message' => 'Invalid email or password.']);
            }
        } elseif (
            isset($input['name']) &&
            isset($input['email']) &&
            isset($input['phone']) &&
            isset($input['subject']) &&
            isset($input['message'])
        ) {
            // Prepare data for controller
            $contactData = [
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'],
                'subject' => $input['subject'],
                'contact_message' => $input['message']
            ];
            $usersController->sendMessageToAdmin($contactData);
        }  // Forgot password request
        elseif (isset($input['forgot_password']) && isset($input['email'])) {
            $usersController->forgotPasswordRequest($input);
        }
        // Reset password
        elseif (isset($input['reset_password']) && isset($input['token']) && isset($input['new_password'])) {
            $usersController->resetPassword($input);
        } elseif (isset($input['send_verification']) && isset($input['email'])) {
            $usersController->sendVerificationEmail($input);
        } else {
            echo json_encode(["message" => "Invalid request: Missing required fields."]);
        }
    },
    "PUT" => function () use ($usersController) {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($_GET['id'])) {
            echo json_encode(["message" => "User ID is required."]);
            return;
        }
        $id = $_GET['id'];
        $usersController->updateUser($id, $input);
    },
    

];
if (array_key_exists($method, $routes)) {
    $routes[$method]();
}

