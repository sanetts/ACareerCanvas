<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php'; 

// Check if the request method is GET
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Fetch unapproved education data from the 'education' table
    $sql = "SELECT * FROM education WHERE status = 'Pending'";
    $result = $conn->query($sql);

    if ($result) {
        // Fetch data as an associative array
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    } else {
        echo json_encode(array("error" => "Error: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
