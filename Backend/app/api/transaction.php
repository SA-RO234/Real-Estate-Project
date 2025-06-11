<?php
require_once __DIR__ . '../../controllers/transactionController.php';
require_once __DIR__ . '../../../config/database.php';
header('Content-Type: application/json');


$db = new Database();
$pdo = $db->getConnection();
$controller = new TransactionController($pdo);
// Get all transactions
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['all'])) {
    echo json_encode($controller->getAll());
    exit;
}

// Get transaction by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    echo json_encode($controller->getById($_GET['id']));
    exit;
}

// Create a new transaction
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($controller->create($data));
    exit;
}

// Update a transaction
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['id'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($controller->update($_GET['id'], $data));
    exit;
}

// Delete a transaction
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    echo json_encode($controller->delete($_GET['id']));
    exit;
}

// Get dashboard statistics
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['dashboard_stats'])) {
    echo json_encode($controller->getDashboardStats());
    exit;
}

// Default response
http_response_code(400);
echo json_encode(['error' => 'Invalid request']);
