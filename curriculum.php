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

    $student_id = intval($data->student_id); 

    // Validate and sanitize the data (you might need to improve this based on your requirements)
    $activity_name = mysqli_real_escape_string($conn, $data->activity_name);
    $organization_name = mysqli_real_escape_string($conn, $data->organization_name);
    $start_date = mysqli_real_escape_string($conn, $data->start_date);
    $end_date = mysqli_real_escape_string($conn, $data->end_date);
    $description = mysqli_real_escape_string($conn, $data->description);
    


    // Insert data into the 'education' table using prepared statements
    $sql = "INSERT INTO co_curriculum(activity_name, organization_name, start_date, end_date,description,student_id)
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $activity_name, $organization_name, $start_date , $end_date, $description, $student_id);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Record inserted successfully"));
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