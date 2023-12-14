<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Assuming the data is sent as JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate that 'status' and 'id' are provided
    if (isset($data['status'], $data['id'])) {
        // Assuming your education table has a primary key column named 'id'
        $status = $data['status'];
        $id = $data['id'];

        // Update the review status in the database
        $sql = "UPDATE project SET status = ? WHERE project_id = ?";

        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $id);

        if ($stmt->execute()) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("error" => "Error updating review status: " . $stmt->error));
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Invalid data. Both 'status' and 'id' must be provided."));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
