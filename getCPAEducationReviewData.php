<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php'; 

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Decode JSON request body
    $requestData = json_decode(file_get_contents("php://input"));

    if ($requestData) {
        // Fetch education data assigned to the specified CPA
        $sql = "SELECT * FROM education WHERE cpa_id = ? AND status = 'PENDING'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $requestData->cpa_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            // Fetch data as an associative array
            $data = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($data);
        } else {
            echo json_encode(array("error" => "Error: " . $conn->error));
        }
    } else {
        echo json_encode(array("error" => "Invalid request data"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
