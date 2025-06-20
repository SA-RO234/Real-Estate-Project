<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Fixed header (correct name and removed spaces)
header("Access-Control-Allow-Headers: Content-Type");

require_once '../controllers/propertyFeatureController.php';
$controller = new propertyFeatureController();
// Get HTTP method and input
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Routing
switch ($method) {
    case 'GET':
        if (isset($_GET['property_id'])) {
            $controller->getAllPropertyFeatureByPropertyID($_GET['property_id']);
        } else {
            $controller->getAllPropertyFeature();
        }
        break;

    case 'POST':
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        if ($name) {
            $controller->addPropertyFeature($name, $description);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Name is required']);
        }
        break;

    case 'PUT':
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        if ($id && $name) {
            $controller->updatePropertyFeature($id, $name, $description);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID and Name are required']);
        }
        break;

    case 'DELETE':
        // For DELETE, id can be passed as query param or in body
        $id = $_GET['id'] ?? ($input['id'] ?? null);
        if ($id) {
            $controller->deletePropertyFeature($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}