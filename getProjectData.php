<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; 

// Check if the request method is GET
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Assuming you are passing student_id as a query parameter
    $student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;

    if ($student_id === null) {
        echo json_encode(array("error" => "Invalid or missing student ID"));
        exit;
    }

    // Fetch education data for the given student ID
    $sql = "SELECT * FROM project WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $student_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();

        // Fetch the result as an associative array
        $projectData = $result->fetch_all(MYSQLI_ASSOC);

        if (empty($projectData)) {
            echo json_encode(array("message" => "No project data found for the given student ID"));
        } else {
            echo json_encode($projectData);
        }
    } else {
        echo json_encode(array("error" => "Error: " . $stmt->error, "sql" => $sql));
    }

    $stmt->close();
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
