<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestData = json_decode(file_get_contents('php://input'), true);

    $newStatus = 'Pending';
    $educationId = $requestData['id'];  
    $studentId = $_GET['student_id'];  

    // Assuming you have a function to determine the CPA for an education item
    $cpaId = determineCPAForEducation($educationId);

    // Update the status in the education table
    $query = "UPDATE education SET status = :status WHERE education_id = :education_id AND status = 'Unapproved'";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':status', $newStatus);
    $stmt->bindParam(':education_id', $educationId);

    try {
        $stmt->execute();

        // Create an assignment entry
        $query = "INSERT INTO assignments (education_id, cpa_id) VALUES (:education_id, :cpa_id)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':education_id', $educationId);
        $stmt->bindParam(':cpa_id', $cpaId);
        $stmt->execute();

        $response = ['message' => 'Status updated successfully'];
        http_response_code(200);
    } catch (PDOException $e) {
        $response = ['error' => 'Error updating status or creating assignment: ' . $e->getMessage()];
        http_response_code(500);
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();


?>