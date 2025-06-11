<?php
require_once __DIR__ . '/../models/transactionModel.php';
class TransactionController
{
    private $model;

    public function __construct($db)
    {
        $this->model = new TransactionModel($db);
    }

    // Create a new transaction
    public function create($data)
    {
        return $this->model->create($data);
    }

    // Get a transaction by ID
    public function getById($id)
    {
        return $this->model->getById($id);
    }

    // Get all transactions
    public function getAll()
    {
        return $this->model->getAll();
    }

    // Update a transaction
    public function update($id, $data)
    {
        return $this->model->update($id, $data);
    }

    // Delete a transaction
    public function delete($id)
    {
        return $this->model->delete($id);
    }


    // Get dashboard statistics
    public function getDashboardStats()
    {
        return $this->model->getDashboardStats();
    }
}