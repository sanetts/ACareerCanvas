<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
    $student_id = intval($data->student_id);
    $projectName = mysqli_real_escape_string($conn, $data->projectName);
    $projectOwner = mysqli_real_escape_string($conn, $data->projectOwner);
    $startDate = mysqli_real_escape_string($conn, $data->startDate);
    $endDate = mysqli_real_escape_string($conn, $data->endDate);
    $projectDescription = mysqli_real_escape_string($conn, $data->projectDescription);

    // Insert data into the 'project' table using prepared statements
    $sql = "INSERT INTO project (project_name, owner, start_date, end_date, project_description, student_id)
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sssssi", $projectName, $projectOwner, $startDate, $endDate, $projectDescription, $student_id);

        if ($stmt->execute()) {
            echo json_encode(array("message" => "Record inserted successfully"));
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(array("error" => "Error executing query: " . $stmt->error));
        }

        $stmt->close();
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error preparing statement"));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "equest method"));
}

// Close the database connection
$conn->close();
?>
