<?php
require_once '../models/PropertyModel.php';
require_once '../../config/database.php';
header("Content-Type: application/json"); // Ensure JSON response


class PropertyController
{
    private $property;
    public function __construct()
    {
        $this->property = new PropertyModel();
    }
    // Controller Method to Handle GET Request for All Properties
    public function getProperties()
    {
        try {
            $stmt = $this->property->getAllProperties();
            $num  = $stmt->rowCount();

            if ($num > 0) {
                $properties_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $property_item = array(
                        "id" => $id,
                        "user_id" => $user_id,
                        "title" => $title,
                        "description" => $description,
                        "price" => $price,
                        "bedrooms" => $bedrooms,
                        "bathrooms" => $bathrooms,
                        "square_feet" => $square_feet,
                        "lot_size" => $lot_size,
                        "year_built" => $year_built,
                        "propertyfor" => $propertyfor,
                        "listed_date" => $listed_date,
                        "hoa_fees" => $hoa_fees,
                        "location_id" => $location_id,
                        "city" => $city,
                        "country" => $country,
                        "image_url" => $image_url,
                    );
                    array_push($properties_arr, $property_item);
                }
                echo json_encode($properties_arr, JSON_PRETTY_PRINT);
            } else {
                echo json_encode(array("message" => "No Properties Found."));
            }
        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
    }


    // Handle GET request for a single property by ID
    public function getPropertyById($id)
    {
        $properties = $this->property->getPropertyById($id);
        if ($properties) {
            echo json_encode($properties);  // Return property data in JSON format
        } else {
            echo json_encode(["message" => "Property not found."]);
        }
    }


    public function addProperty()
    {
        try {
            // Get data from request body
            $data = json_decode(file_get_contents("php://input"), true);

            // Check if required fields are present
            $requiredFields = ['title', 'description', 'price', 'location_id', 'user_id', 'status'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    throw new Exception("Missing required field: " . $field);
                }
            }

            // Extract data with defaults for optional fields
            $title = $data['title'];
            $description = $data['description'];
            $price = $data['price'];
            $location_id = $data['location_id'];
            $user_id = $data['user_id'];
            $property_for = $data['property_for'] ?? 'Both';
            $property_type_id = $data['property_type_id'] ?? null;
            $bedrooms = $data['bedrooms'] ?? 0;
            $bathrooms = $data['bathrooms'] ?? 0;
            $square_feet = $data['square_feet'] ?? 0;
            $lot_size = $data['lot_size'] ?? 0;
            $year_built = $data['year_built'] ?? date('Y');
            $status = $data['status'];
            $listed_date = $data['listed_date'] ?? date('Y-m-d H:i:s');
            $hoa_fees = $data['hoa_fees'] ?? 0;
            $features = $data['features'] ?? [];

            // Call the model to add the property
            $success = $this->property->addProperty(
                $title,
                $description,
                $price,
                $location_id,
                $property_for,
                $property_type_id,
                $user_id,
                $bedrooms,
                $bathrooms,
                $square_feet,
                $lot_size,
                $year_built,
                $status,
                $listed_date,
                $hoa_fees,
                $features
            );

            if ($success) {
                echo "Success";
                echo json_encode(["message" => "Property added successfully!"]);
            } else {
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to add property"
                ]);
            }
        } catch (Exception $e) {
            http_response_code(400); // Bad request
            echo json_encode(["error" => $e->getMessage()]);
        }
    }


    public function updateProperty()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->property->updateProperty($data['id'], $data['title'], $data['description'], $data['price'], $data['location']);
        echo json_encode(['message' => "Property Updated Successfuly ! "]);
    }


    public function deleteProperty()
    {
        // Get JSON input and decode it
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if the data is valid and contains an ID
        if (!isset($data['id'])) {
            echo json_encode(['error' => "Property ID is required."]);
            http_response_code(400); // Bad Request
            return;
        }
        $id = intval($_GET['id']);
        echo ("ID : " . $id);
        // Attempt to delete the property
        if ($this->property->deleteProperty($id)) {
            echo json_encode(['message' => "Property deleted successfully!"]);
            http_response_code(200); // OK
        } else {
            echo json_encode(['error' => "Failed to delete property."]);
            http_response_code(500); // Internal Server Error
        }
    }

    // Handle GET request for property ads (for advertisement)
    public function getPropertyforAd()
    {
        try {
            $stmt = $this->property->getPropertyforAd();
            $num  = $stmt->rowCount();
            if ($num > 0) {
                $ads_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $ads_arr[] = $row;
                }
                echo json_encode($ads_arr, JSON_PRETTY_PRINT);
            } else {
                echo json_encode(array("message" => "No Property Ads Found."));
            }
        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
    }

    //  Handle GET request for property type count
    public function getPropertyTypeCount()
    {
        try {
            $stmt = $this->property->getPropertyTypeCount();
            if ($stmt === false) {
                echo json_encode(['error' => 'Database query failed.']);
                return;
            }
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = [
                    'property_type_id' => $row['property_type_id'],
                    'property_type_name' => $row['property_type_name'],
                    'count' => $row['count'],
                    'image_url' => $row['image_url']
                ];
            }
            echo json_encode($result, JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // get Property of each City 
    public function getPropertyOfEachCity()
    {
        try {
            $stmt = $this->property->getPropertyOfEachCity();
            if ($stmt === false) {
                echo json_encode(['error' => 'Database query failed.']);
                return;
            }
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = [
                    'City' => $row['city'],
                    'Count' => $row['property_count'],
                    'City_image' => $row['city_image']
                ];
            }
            echo json_encode($result, JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


    // get Property by type
    public function getPropertyByType($type)
    {
        try {
            $stmt = $this->property->getPropertyByType($type);
            if ($stmt === false) {
                echo json_encode(['error' => 'Database query failed.']);
                return;
            }
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = $row;
            }
            echo json_encode($result, JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    //  get all property types
    public function getAllPropertyTypes()
    {
        try {
            $stmt = $this->property->getAllPropertyTypes();
            if ($stmt === false) {
                echo json_encode(['error' => 'Database query failed.']);
                return;
            }
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = $row;
            }
            echo json_encode($result, JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // get property by filter 
    public function getPropertyByFilter($filter)
    {
        try {
            // Extract filter values with defaults
            $bedrooms = isset($filter['bedrooms']) ? $filter['bedrooms'] : null;
            $location_id = isset($filter['location']) ? $filter['location'] : null;
            $minPrice = isset($filter['minPrice']) ? $filter['minPrice'] : null;
            $maxPrice = isset($filter['maxPrice']) ? $filter['maxPrice'] : null;
            $propertyTypeId = isset($filter['propertyType']) ? $filter['propertyType'] : null;

            // Pass as individual arguments
            $stmt = $this->property->getPropertiesByFilter($bedrooms, $location_id, $minPrice, $maxPrice, $propertyTypeId);
            if ($stmt === false) {
                echo json_encode(['error' => 'Database query failed.']);
                return;
            }
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = $row;
            }
            echo json_encode($result, JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
