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
require_once "../../config/database.php";
require "../controllers/passwordResetController.php";

$usersController = new UserController();
$resetController = new ForgotPasswordController();
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
    "POST" => function () use ($usersController, $resetController) {
        $input = json_decode(file_get_contents("php://input"), true);

        // Registration
        if (
            isset($input['name']) && isset($input["email"]) &&
            isset($input['phone']) && isset($input["password"]) &&
            isset($input['role'])
        ) {
            $usersController->register($input);
        }

        // Contact message
        elseif (
            isset($input['name']) &&
            isset($input['email']) &&
            isset($input['phone']) &&
            isset($input['subject']) &&
            isset($input['message'])
        ) {
            $contactData = [
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'],
                'subject' => $input['subject'],
                'contact_message' => $input['message']
            ];
            $usersController->sendMessageToAdmin($contactData);
        }
        // Login
        elseif (isset($input['email']) && isset($input['password'])) {
            Session::Start();
            $user = $usersController->login($input['email'], $input['password']);
            if ($user && isset($user['error'])) {
                echo json_encode(['message' => $user['error']]);
            } elseif ($user) {
                Session::set('user_id', $user['id']);
                Session::set('email', $user['email']);
                echo json_encode([
                    'message' => "Login Successfuly",
                    'session_id' => session_id(),
                    'user' => $user
                ]);
            } else {
                echo json_encode(['message' => 'Invalid email or password.']);
            }
        } elseif (isset($input['forgot_password']) && !empty($input['email'])) {
            echo json_encode($resetController->requestReset($input['email']));
        } elseif (isset($input['reset_password']) && !empty($input['token']) && !empty($input['password'])) {
            echo json_encode($resetController->resetPassword($input['token'], $input['password']));
        }
        // Invalid request
        else {
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
