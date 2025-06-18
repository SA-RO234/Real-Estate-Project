<?php
require_once "../models/locationModel.php";
class locationController
{
    private $model;
    public function __construct()
    {
        $this->model = new locationModel();
    }

    // Get all locations
    public function getAllLocations()
    {
        return $this->model->getAllLocations();
    }

    // Get only name

    public function getCityName()
    {
        return $this->model->getCityName();
    }


    // Add a new location
    public function addLocation($city, $country, $city_image)
    {
        return $this->model->addLocation($city, $country, $city_image);
    }

    // Update a location
    public function updateLocation($id, $city, $country, $city_image)
    {
        return $this->model->updateLocation($id, $city, $country, $city_image);
    }

    // Delete a location
    public function deleteLocation($id)
    {
        return $this->model->deleteLocation($id);
    }
}
