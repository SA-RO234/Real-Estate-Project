<?php
require_once "../../config/database.php";

class PropertyModel
{
    private $conn;
    private $table_name = "properties";
    public $id;           // int, not null, auto_increment
    public $user_id;      // int, not null (renamed from $users_id)
    public $title;        // varchar(255), not null
    public $description;  // text, nullable
    public $price;        // decimal(12,2), not null
    public $bedrooms;     // int, nullable
    public $bathrooms;    // int, nullable
    public $square_feet;  // int, nullable
    public $lot_size;     // varchar(50), nullable
    public $year_built;   // int, nullable
    public $status;       // varchar(50), nullable
    public $listed_date;  // date, nullable (replacing $created_at)
    public $hoa_fees;     // decimal(10,2), nullable
    public $location_id;  // int, nullable (replacing $location)
    public $city;         // varchar(100), nullable (renamed from $location)
    public $country;      // varchar(100), nullable (renamed from $location)
    public $imageForAd;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    //   Retrieve all property from database 
    public function getAllproperties()
    {
        try {
            $query = "SELECT 
                    p.*, 
                    locations.*,
                    COALESCE(p.property_for, 'unknown') AS property_for,
                    (SELECT image_url FROM images WHERE property_id = p.id LIMIT 1) AS image_url
                  FROM {$this->table_name} p
                  INNER JOIN locations ON p.location_id = locations.id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            die('Database Error : ' . $e->getMessage());
        }
    }

    public function getPropertyforAd()
    {
        try {
            $query = "SELECT p.id, p.title , p.description ,images.image_url AS ad_image_url 
                    FROM properties p 
                    LEFT JOIN images ON images.property_id = p.id AND images.imageForAd = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            die('Database Error : ' . $e->getMessage());
        }
    }

    //  Retrieve  a single property by id ;
    public function getPropertybyID($id)
    {
        try {
            global $conn;
            $stmt = $this->conn->prepare("SELECT * FROM  properties WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error retrieving property by ID: " . $e->getMessage());
            return false;
        }
    }


    // Insert a new property into database
    public function addProperty(
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
        $features = []
    ) {
        try {
            // Start transaction
            $this->conn->beginTransaction();
            $query = "INSERT INTO properties (
                user_id, title, description, price, location_id, property_for, property_type_id,
                bedrooms, bathrooms, square_feet, lot_size, year_built, status, listed_date, hoa_fees
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                $user_id,
                $title,
                $description,
                $price,
                $location_id,
                $property_for,
                $property_type_id,
                $bedrooms,
                $bathrooms,
                $square_feet,
                $lot_size,
                $year_built,
                $status,
                $listed_date,
                $hoa_fees
            ]);

            $property_id = $this->conn->lastInsertId();

            if (!empty($features)) {
                $featureQuery = "INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)";
                $featureStmt = $this->conn->prepare($featureQuery);
                foreach ($features as $feature_id) {
                    $featureStmt->execute([$property_id, $feature_id]);
                }
            }

            // Commit transaction
            $this->conn->commit();
            // Return the new property ID
            return $property_id;
        } catch (PDOException $e) {
            error_log("Error inserting property: " . $e->getMessage());
            $this->conn->rollBack();
            return false;
        }
    }

    // Update an existing property
    public function updateProperty($id, $title, $description, $price, $location_id)
    {
        $stmt = $this->conn->prepare("UPDATE properties SET title = ?, description = ?, price = ?, location_id = ? WHERE id = ?");
        $stmt->execute([$title, $description, $price, $location_id, $id]);
    }

    // Delete a property
    public function deleteProperty($id)
    {
        try {
            $stmt = $this->conn->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            error_log("Delete Property Error: " . $e->getMessage());
            return false;
        }
    }

    //  Get Number Type of property
    public function getPropertyTypeCount()
    {
        try {
            $stmt = $this->conn->prepare(
                "SELECT 
                    pt.id AS property_type_id,
                    pt.name AS property_type_name,
                    COUNT(p.id) AS count,
                    (SELECT image_url FROM images WHERE property_id = MIN(p.id) LIMIT 1) AS image_url
                 FROM property_types pt
                 LEFT JOIN properties p ON p.property_type_id = pt.id
                 GROUP BY pt.id, pt.name"
            );
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log('Error retrieving property type count: ' . $e->getMessage());
            return false;
        }
    }

    //  get Count property Location 
    function getPropertyofEachCity()
    {
        try {
            $stmt = $this->conn->prepare("SELECT  * FROM locations");
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log('Error retrieving property of each City count: ' . $e->getMessage());
            return false;
        }
    }

    // get all property types
    public function getAllPropertyTypes()
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM property_types");
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error retrieving all property types: " . $e->getMessage());
            return false;
        }
    }
    
    public function getPropertiesByFilter($bedrooms, $location_id, $minPrice, $maxPrice, $propertyTypeId)
    {
        try {
            $query = "SELECT p.*, pt.name AS property_type_name, l.city, l.country
                      FROM properties p
                      INNER JOIN property_types pt ON p.property_type_id = pt.id
                      INNER JOIN locations l ON p.location_id = l.id
                      WHERE 1=1";
            $params = [];

            if (!empty($bedrooms)) {
                $query .= " AND p.bedrooms = ?";
                $params[] = $bedrooms;
            }
            if (!empty($location_id)) {
                $query .= " AND p.location_id = ?";
                $params[] = $location_id;
            }
            if (!is_null($minPrice)) {
                $query .= " AND p.price >= ?";
                $params[] = $minPrice;
            }
            if (!is_null($maxPrice)) {
                $query .= " AND p.price <= ?";
                $params[] = $maxPrice;
            }
            if (!empty($propertyTypeId)) {
                $query .= " AND p.property_type_id = ?";
                $params[] = $propertyTypeId;
            }

            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error retrieving filtered properties: " . $e->getMessage());
            return false;
        }
    }
}
