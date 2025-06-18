<?php
require_once '../../config/database.php';
class propertyFeatureModel
{
    private $db;
    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection(); 
    }

    // Get all property features
    public function getAllPropertyFeature()
    {
        $stmt = $this->db->prepare("SELECT * FROM features");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add a new property feature
    public function addPropertyFeature($name, $description = null)
    {
        $stmt = $this->db->prepare("INSERT INTO features (name) VALUES (:name)");
        return $stmt->execute([
            ':name' => $name,
        ]);
    }

    // Delete a property feature by ID
    public function deletePropertyFeature($id)
    {
        $stmt = $this->db->prepare("DELETE FROM features WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    // Update a property feature by ID
    public function updatePropertyFeature($id, $name, $description = null)
    {
        $stmt = $this->db->prepare("UPDATE features SET name = :name  WHERE id = :id");
        return $stmt->execute([
            ':id' => $id,
            ':name' => $name,
        ]);
    }
}