<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

ini_set('display_startup_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        // Assuming the data is sent as JSON
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate that 'status' and 'id' are provided
        if (isset($data['status'], $data['id'])) {
            // Assuming your education table has a primary key column named 'education_id'
            $status = $data['status'];
            $id = $data['id'];


            // Update the review status in the database
            $sql = "UPDATE education SET status = ? WHERE id = ?";

            // Use prepared statement to prevent SQL injection
            $stmt = $conn->prepare($sql);

            // Check if prepare was successful
            if (!$stmt) {
                throw new Exception("Error in prepared statement: " . $conn->error);
            }

            $stmt->bind_param("si", $status, $id);

            if ($stmt->execute()) {
                echo json_encode(array("success" => true));
            } else {
                echo json_encode(array("error" => "Error updating review status: " . $stmt->error));
            }

            // Close the prepared statement
            $stmt->close();
        } else {
            throw new Exception("Invalid data. Both 'status' and 'id' must be provided.");
        }
    } catch (Exception $e) {
        // Log the exception to an error log
        error_log("Exception: " . $e->getMessage());

        // Provide a generic error response without revealing internal details
        echo json_encode(array("error" => "An error occurred while processing the request."));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
