<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Fixed header (correct name and removed spaces)
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the path to route to the correct API
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$apiBase = '/app/api/'; // Adjust if your base path is different

if (str_ends_with($uri, '/users') || str_ends_with($uri, '/users.php')) {
    require_once __DIR__ . '/users.php';
    exit();
} elseif (str_ends_with($uri, '/messages') || str_ends_with($uri, '/messages.php')) {
    require_once __DIR__ . '/messages.php';
    exit();
}

require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad();

require_once __DIR__ . "/../controllers/PropertyController.php";

$properTyController = new PropertyController();
$method = $_SERVER["REQUEST_METHOD"];
$request = json_decode(file_get_contents("php://input"), true);

$routes = [
    'GET' => function () use ($properTyController) {
        if (isset($_GET['ads'])) {
            $properTyController->getPropertyforAd();
        } elseif (isset($_GET['id'])) {
            $properTyController->getPropertyById($_GET['id']);
        } elseif (isset($_GET['typeCount'])) {
            $properTyController->getPropertyTypeCount();
        } elseif (isset($_GET['byCity'])) {
            $properTyController->getPropertyOfEachCity();
        } elseif (isset($_GET['propertyType'])) {
            $properTyController->getPropertyByType($_GET['propertyType']);
        } else if (isset($_GET["allpropertiestype"])) {
            $properTyController->getAllPropertyTypes();
        } else {
            $properTyController->getProperties();
        }
    },
    'POST' => function () use ($properTyController, $request) {
        // If the request contains filter keys, call the filter method
        if (
            isset($request['bedrooms']) ||
            isset($request['location']) ||
            isset($request['minPrice']) ||
            isset($request['maxPrice']) ||
            isset($request['propertyType'])
        ) {
            $properTyController->getPropertyByFilter($request);
        } else {
            $properTyController->addProperty(
                $request['title'] ?? null,
                $request['description'] ?? null,
                $request['price'] ?? null,
                $request['location_id'] ?? null,
                $request['property_for'] ?? null,
                $request['property_type_id'] ?? null,
                $request['user_id'] ?? null,
                $request['bedrooms'] ?? null,
                $request['bathrooms'] ?? null,
                $request['square_feet'] ?? null,
                $request['lot_size'] ?? null,
                $request['year_built'] ?? null,
                $request['status'] ?? null,
                $request['listed_date'] ?? null,
                $request['hoa_fees'] ?? null,
                $request['features'] ?? []
            );
        }
    },
    'PUT' => function () use ($properTyController) {
        $properTyController->updateProperty();
    },
    'DELETE' => function () use ($properTyController) {
        $properTyController->deleteProperty();
    }
];


if (array_key_exists($method, $routes)) {
    $routes[$method]();
} else {
    echo json_encode(["message" => "Invalid HTTP Method ! "]);
}

// Utility: Convert all plain text passwords to hashed passwords
function convertPlainPasswordsToHash()
{
    require_once __DIR__ . "/../../config/database.php";
    $database = new Database();
    $db = $database->getConnection();

    $stmt = $db->query("SELECT id, password FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as $user) {
        $current = $user['password'];
        // If already hashed (starts with $2y$), skip
        if (strpos($current, '$2y$') === 0) continue;
        $hashed = password_hash($current, PASSWORD_BCRYPT);
        $update = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
        $update->execute([':password' => $hashed, ':id' => $user['id']]);
    }
    echo json_encode(["message" => "Password conversion completed."]);
}

// Example usage: call this function by visiting /app/api/index.php?convert_passwords=1
if (isset($_GET['convert_passwords']) && $_GET['convert_passwords'] == 1) {
    convertPlainPasswordsToHash();
    exit();
}
