<?php
require_once __DIR__ . '/../models/UploadImageModel.php';

class UploadImageController
{
    // Create a new image for a property
    public function create(){
        // Example: get data from POST request
        $property_id = $_POST['property_id'] ?? null;
        $image_url = $_POST['image_url'] ?? null;
        $caption = $_POST['caption'] ?? null;
        $image_for_ad = $_POST['image_for_ad'] ?? 0;

        if (!$property_id || !$image_url) {
            http_response_code(400);
            echo json_encode(['error' => 'property_id and image_url are required']);
            return;
        }

        $imageModel = new UploadImageModel();
        $imageModel->property_id = (int)$property_id;
        $imageModel->image_url = $image_url;
        $imageModel->caption = $caption;
        $imageModel->image_for_ad = (int)$image_for_ad;

        if ($imageModel->createImage()) {
            http_response_code(201);
            echo json_encode(['message' => 'Image uploaded successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload image']);
        }
    }

    // Get all images for a property
    public function getByProperty($property_id)
    {
        $imageModel = new UploadImageModel();
        $images = $imageModel->getImagesByProperty((int)$property_id);

        echo json_encode($images);
    }
}