<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php'; 

// Check if the request method is GET
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    
    $studentId = $_GET['student_id'];  
    $sql = "SELECT * FROM education WHERE student_id = ? AND status = 'unapproved'";
    
    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $studentId);
    
    if ($stmt->execute()) {
        // Fetch data as an associative array
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    } else {
        echo json_encode(array("error" => "Error: " . $stmt->error));
    }

    // Close the prepared statement
    $stmt->close();
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
