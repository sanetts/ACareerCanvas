<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Collect JSON data from the request body
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data);

    if ($data === null) {
        echo json_encode(array("error" => "Invalid JSON data"));
        exit;
    }

    // Validate and sanitize the data (you might need to improve this based on your requirements)
    $firstName = mysqli_real_escape_string($conn, $data->first_name);
    $lastName = mysqli_real_escape_string($conn, $data->last_name);
    $email = mysqli_real_escape_string($conn, $data->email);
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    $role = mysqli_real_escape_string($conn, $data->role);

    // Check if the role is CPA and validate the invitation code
    if ($data->role === "cpa") {
        $invitationCode = mysqli_real_escape_string($conn, $data->invitationCode);
        $validateInvitationSql = "SELECT id FROM invitations WHERE code = ? AND email = ?";
        $validateInvitationStmt = $conn->prepare($validateInvitationSql);
        $validateInvitationStmt->bind_param("ss", $invitationCode, $email);
        $validateInvitationStmt->execute();
        $validateInvitationResult = $validateInvitationStmt->get_result();

        if ($validateInvitationResult->num_rows === 0) {
            echo json_encode(array("error" => "Invalid invitation code or email for CPA registration"));
            $validateInvitationStmt->close();
            exit;
        }

        $validateInvitationStmt->close();
    }

    // Insert user into the student table
    $insertStudentSql = "INSERT INTO student (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
    $insertStudentStmt = $conn->prepare($insertStudentSql);
    $insertStudentStmt->bind_param("sssss", $firstName, $lastName, $email, $password, $role);

    if ($insertStudentStmt->execute()) {
        // Retrieve the last inserted student ID
        $student_id = $insertStudentStmt->insert_id;

        // If the role is CPA, insert the student ID into the cpa table
        if ($data->role === "cpa") {
            $insertCpaSql = "INSERT INTO cpa (student_id) VALUES (?)";
            $insertCpaStmt = $conn->prepare($insertCpaSql);
            $insertCpaStmt->bind_param("i", $student_id);
            $insertCpaStmt->execute();
            $insertCpaStmt->close();
        }

        // If the role is CPA, remove the used invitation code
        if ($data->role === "cpa") {
            $removeInvitationSql = "DELETE FROM invitations WHERE code = ? AND email = ?";
            $removeInvitationStmt = $conn->prepare($removeInvitationSql);
            $removeInvitationStmt->bind_param("ss", $invitationCode, $email);
            $removeInvitationStmt->execute();
            $removeInvitationStmt->close();
        }

        echo json_encode(array("message" => "New student created successfully. Student ID: $student_id"));
    } else {
        echo json_encode(array("error" => "Error: " . $insertStudentStmt->error));
    }

    $insertStudentStmt->close();
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
