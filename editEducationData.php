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
    $educationId = intval($data->education_id);
    $universityName = mysqli_real_escape_string($conn, $data->university_name);
    $programOfStudy = mysqli_real_escape_string($conn, $data->program_of_study);
    $startDate = mysqli_real_escape_string($conn, $data->start_date);
    $endDate = mysqli_real_escape_string($conn, $data->end_date);
    
    // Update data in the 'education' table using prepared statements
    $sql = "UPDATE education SET university_name=?, program_of_study=?, start_date=?, end_date=? WHERE education_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $universityName, $programOfStudy, $startDate, $endDate, $educationId);

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
