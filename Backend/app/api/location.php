<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Fixed header (correct name and removed spaces)
header("Access-Control-Allow-Headers: Content-Type");

require_once "../controllers/locationController.php";

$controller = new locationController();

// Get HTTP method and input
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['only']) && $_GET['only'] === 'city') {
            $result = $controller->getCityName();
            echo json_encode($result, JSON_PRETTY_PRINT);
        } else {
            $result = $controller->getAllLocations();
            echo json_encode($result, JSON_PRETTY_PRINT);
        }
        break;

    case 'POST':
        if (isset($input['city'], $input['country'], $input['city_image'])) {
            $success = $controller->addLocation($input['city'], $input['country'], $input['city_image']);
            echo json_encode(['success' => $success]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing parameters']);
        }
        break;

    case 'PUT':
        if (isset($_GET['id'], $input['city'], $input['country'], $input['city_image'])) {
            $success = $controller->updateLocation($_GET['id'], $input['city'], $input['country'], $input['city_image']);
            echo json_encode(['success' => $success]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing parameters']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $success = $controller->deleteLocation($_GET['id']);
            echo json_encode(['success' => $success]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}