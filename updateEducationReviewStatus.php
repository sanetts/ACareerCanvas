<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400");

include 'db.php';
include 'other_functions.php';

// Ensure a valid MySQLi connection
if (!$conn instanceof mysqli) {
    respondWithError('Invalid database connection', 500);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON data
    $requestData = json_decode(file_get_contents('php://input'), true);

    // Validate studentId
    $studentId = $requestData['studentId'];
    if (!$studentId || !is_numeric($studentId)) {
        respondWithError('Invalid or missing studentId', 400);
    }

    // Validate educationId
    $educationId = $requestData['id'];
    if (!$educationId || !is_numeric($educationId)) {
        respondWithError('Invalid or missing educationId', 400);
    }

    // Determine CPA for education
    $cpaId = determineCPAForEducation($educationId, $conn);

    // Check if CPA is available
    if (!$cpaId) {
        respondWithError('No available CPA found', 500);
    }

    try {
        // Begin transaction
        $conn->begin_transaction();

        // Prepare UPDATE query for education status
        $queryUpdateEducation = "UPDATE education SET status = ? WHERE id = ? AND status = 'Unapproved'";
        $stmtUpdateEducation = $conn->prepare($queryUpdateEducation);

        // Check if prepare was successful
        if (!$stmtUpdateEducation) {
            throw new Exception('Error in UPDATE prepare statement: ' . $conn->error);
        }

        // Bind parameters
        $newStatus = 'Pending'; // Assuming the new status is 'Approved'
        $stmtUpdateEducation->bind_param('si', $newStatus, $educationId);

        // Execute UPDATE query for education status
        $stmtUpdateEducation->execute();


        // Bind parameters for the INSERT query for assignment
$queryInsertAssignment = "INSERT INTO assignments (education_id, cpa_id, comments) VALUES (?, ?, ?)";
$stmtInsertAssignment = $conn->prepare($queryInsertAssignment);

// Check if prepare was successful
if (!$stmtInsertAssignment) {
    throw new Exception('Error in INSERT prepare statement: ' . $conn->error);
}

// Assuming you have a comments value, replace 'your_comments_value' with the actual value
$comments = 'Good';

// Bind parameters for the INSERT query
$stmtInsertAssignment->bind_param('iis', $educationId, $cpaId, $comments);

// Execute INSERT query for assignment
$stmtInsertAssignment->execute();


        // Commit the transaction
        $conn->commit();

        // Respond with success message
        respondWithSuccess('Status updated successfully');
    } catch (Exception $e) {
        // Rollback the transaction on error
        $conn->rollback();

        // Log the error for debugging
        error_log('Error updating status or creating assignment: ' . $e->getMessage());

        // Respond with error message
        respondWithError('Error updating status or creating assignment', 500);
    }
} else {
    // Respond with error for invalid request method
    respondWithError('Invalid request method', 400);
}

// Close the database connection
$conn->close();

/**
 * Respond with an error message and status code.
 *
 * @param string $message The error message.
 * @param int $statusCode The HTTP status code.
 */
function respondWithError($message, $statusCode)
{
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode(['error' => $message]);
    exit;
}

/**
 * Respond with a success message.
 *
 * @param string $message The success message.
 */
function respondWithSuccess($message)
{
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode(['message' => $message]);
    exit;
}
?>
