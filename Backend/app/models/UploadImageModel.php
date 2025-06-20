<?php
require_once "../../config/database.php";
class UploadImageModel
{
    public int $id;
    public int $property_id;
    public string $image_url;
    public ?string $caption;
    public ?string $uploaded_at;
    public int $image_for_ad;
    public $db;
    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Create a new image record
    public function createImage(): bool
    {
        $sql = "INSERT INTO images (property_id, image_url, caption, uploaded_at, image_for_ad)
                 VALUES (:property_id, :image_url, :caption, NOW(), :image_for_ad)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':property_id' => $this->property_id,
            ':image_url' => $this->image_url,
            ':caption' => $this->caption,
            ':image_for_ad' => $this->image_for_ad
        ]);
    }


    // Get all images for a property
    public function getImagesByProperty(int $property_id): array
    {
        $sql = "SELECT * FROM images WHERE property_id = :property_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':property_id' => $property_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
