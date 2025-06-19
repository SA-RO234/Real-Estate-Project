<?php
require_once "../../config/database.php";
class locationModel{
    private $db;
    public function __construct()
    {
        $database  = new Database();
        $this->db = $database->getConnection();
    }

    // Get all locations
    public function getAllLocations()
    {
        $stmt = $this->db->prepare("SELECT * FROM locations");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Get only city names
    public function getCityName()
    {
        $stmt = $this->db->prepare("SELECT city FROM locations");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Add a new location
    public function addLocation($city, $country, $city_image)
    {
        $stmt = $this->db->prepare("INSERT INTO locations (city, country, city_image) VALUES (:city, :country, :city_image)");
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':country', $country);
        $stmt->bindParam(':city_image', $city_image);
        return $stmt->execute();
    }

    // Update a location
    public function updateLocation($id, $city, $country, $city_image)
    {
        $stmt = $this->db->prepare("UPDATE locations SET city = :city, country = :country, city_image = :city_image WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':country', $country);
        $stmt->bindParam(':city_image', $city_image);
        return $stmt->execute();
    }

    // Delete a location
    public function deleteLocation($id)
    {
        $stmt = $this->db->prepare("DELETE FROM locations WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}