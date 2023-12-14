<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming you receive comments and assignmentId in the request body
    $requestData = json_decode(file_get_contents('php://input'), true);

    $assignmentId = isset($requestData['assignmentId']) ? intval($requestData['assignmentId']) : 0;
    $comment = isset($requestData['comment']) ? $requestData['comment'] : '';

    if ($assignmentId > 0 && $comment !== '') {
        // Insert a new comment entry in the assignments table
        $queryInsertComment = "INSERT INTO assignments (comments) VALUES (?)";

        $stmtInsertComment = $conn->prepare($queryInsertComment);

        if ($stmtInsertComment === false) {
            $error = $conn->error;
            error_log("Prepare failed: $error", 0);
            die(json_encode(['error' => 'Error preparing statement: ' . $error]));
        }

        $stmtInsertComment->bind_param('s', $comment);
        $stmtInsertComment->execute();

        if ($stmtInsertComment->affected_rows > 0) {
            $response = ['message' => 'Comment added successfully'];
            http_response_code(200);
        } else {
            $error = $stmtInsertComment->error;
            error_log("Execute failed: $error", 0);
            $response = ['error' => 'Error adding comment: ' . $error];
            http_response_code(500);
        }

        $stmtInsertComment->close();

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Invalid or missing assignment ID or comment.']);
    }
}
?>
