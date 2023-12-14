<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php'; 

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Collect JSON data from the request body
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data);

    // Validate and sanitize the data (you might need to improve this based on your requirements)
    $projectId = intval($data->project_id);
    $projectName = mysqli_real_escape_string($conn, $data->project_name);
    $owner = mysqli_real_escape_string($conn, $data->owner);
    $startDate = mysqli_real_escape_string($conn, $data->start_date);
    $endDate = mysqli_real_escape_string($conn, $data->end_date);
    $projectDescription = mysqli_real_escape_string($conn, $data->project_description);
    
    // Update data in the 'education' table using prepared statements
    $sql = "UPDATE education SET project_name=?, owner=?, start_date=?, end_date=?, project_description=? WHERE project_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $projectName, $owner, $startDate, $endDate,$projectDescription, $projectId);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Record"));
    } else {
        echo json_encode(array("error" => "Error: " . $stmt->error));
    }

    $stmt->close();
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
