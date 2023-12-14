<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $studentId = isset($_GET['studentId']) ? intval($_GET['studentId']) : 0;

    if ($studentId > 0) {
        // Assuming you have a table named 'education' with columns 'student_id' and 'education_id'
        $queryGetEducationId = "SELECT id FROM education WHERE student_id = ? LIMIT 1";

        $stmtGetEducationId = $conn->prepare($queryGetEducationId);

        if ($stmtGetEducationId === false) {
            $error = $conn->error;
            error_log("Prepare failed: $error", 0);
            die("Error: $error");
        }

        $stmtGetEducationId->bind_param('i', $studentId);
        $stmtGetEducationId->execute();
        $stmtGetEducationId->bind_result($educationId);

        if ($stmtGetEducationId->fetch()) {
            $response = ['educationId' => $educationId];
            http_response_code(200);
        } else {
            $response = ['error' => 'Education ID not found for the provided student ID'];
            http_response_code(404);
        }

        $stmtGetEducationId->close();

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Invalid or missing student ID.']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET requests are allowed.']);
}
?>
