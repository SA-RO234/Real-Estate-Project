<?php
require_once '../models/propertyFeatureModel.php';

class propertyFeatureController{
    private $model;
    public function __construct()
    {
        $this->model = new propertyFeatureModel();
    }

    // Get all property features
    public function getAllPropertyFeature()
    {
        $features = $this->model->getAllPropertyFeature();
        header('Content-Type: application/json');
        echo json_encode($features,JSON_PRETTY_PRINT);
    }

    // Add a new property feature
    public function addPropertyFeature($name)
    {
        $result = $this->model->addPropertyFeature($name);
        header('Content-Type: application/json');
        echo json_encode(['success' => $result]);
    }

    // Delete a property feature by ID
    public function deletePropertyFeature($id){
        $result = $this->model->deletePropertyFeature($id);
        header('Content-Type: application/json');
        echo json_encode(['success' => $result]);
    }

    // Update a property feature by ID
    public function updatePropertyFeature($id, $name)
    {
        $result = $this->model->updatePropertyFeature($id, $name);
        header('Content-Type: application/json');
        echo json_encode(['success' => $result]);
    }
}