<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the student ID from the query parameters
    $student_id = isset($_GET['studentId']) ? intval($_GET['studentId']) : 0;

    if ($student_id > 0) {
        // Fetch the CPA ID for the given student ID
        $query = "SELECT cpa.cpa_id FROM cpa WHERE student_id = ?";

        // Use your existing database connection object
        $stmt = $conn->prepare($query);
        if ($stmt === false) {
            die("Error: " . $conn->error); // Print detailed error information
        }

        $stmt->bind_param('i', $student_id);
        $stmt->execute();
        $stmt->bind_result($cpa_id);
        $stmt->fetch();
        $stmt->close();

        if ($cpa_id) {
            // Fetch assigned items for the CPA from the assignments table
            $queryAssignedItems = "SELECT e.*, a.assignment_id, a.comments FROM education e
                                    JOIN assignments a ON e.id = a.education_id
                                    WHERE a.cpa_id = ?";

            $stmtAssignedItems = $conn->prepare($queryAssignedItems);

            if ($stmtAssignedItems === false) {
                die("Error: " . $conn->error); // Print detailed error information
            }

            $stmtAssignedItems->bind_param('i', $cpa_id);
            $stmtAssignedItems->execute();
            $result = $stmtAssignedItems->get_result();

            // Fetch all assigned items as an associative array
            $assignedItems = $result->fetch_all(MYSQLI_ASSOC);

            // Return the assigned items as JSON
            header('Content-Type: application/json');
            echo json_encode($assignedItems);
        } else {
            echo json_encode(['error' => 'No result found for the given student ID.']);
        }
    } else {
        echo json_encode(['error' => 'Invalid or missing student ID.']);
    }
}
?>
