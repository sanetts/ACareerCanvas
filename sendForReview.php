<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php'; 
// Assuming you have received the request as a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the JSON data from the request body
    $requestData = json_decode(file_get_contents('php://input'), true);

    // Assuming the status is changing to 'Pending'
    $newStatus = 'Pending';

    // Update the status in the database
    $studentId = $requestData['studentId']; // Make sure you send studentId from the frontend
    $query = "UPDATE education SET status = :status WHERE student_id = :student_id AND status = 'Unapproved'";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':status', $newStatus);
    $stmt->bindParam(':student_id', $studentId);

    try {
        $stmt->execute();
        $response = ['message' => 'Status updated successfully'];
        http_response_code(200);
    } catch (PDOException $e) {
        $response = ['error' => 'Error updating status: ' . $e->getMessage()];
        http_response_code(500);
    }

    // Send the response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}
$conn->close();
?>