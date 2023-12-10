<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Get the raw POST data
$postData = file_get_contents("php://input");

// Decode the JSON data
$data = json_decode($postData, true); // Set the second parameter to true for an associative array

$response = array();

// Check if the invitation code is present in the decoded data
if (!isset($data['invitationCode'])) {
    $response["valid"] = false;
    $response["error"] = "Invitation code is missing";
} else {
    // Extract the invitation code
    $invitationCode = mysqli_real_escape_string($conn, $data['invitationCode']);

    // Validate the invitation code
    $checkInvitationQuery = "SELECT * FROM invitations WHERE TRIM(BINARY code) = TRIM('$invitationCode') AND BINARY is_active = 1 ";
    $checkInvitationResult = mysqli_query($conn, $checkInvitationQuery);

    // Debugging output
    $response["check"] = $checkInvitationQuery;

    if ($checkInvitationResult) {
        $row = mysqli_fetch_assoc($checkInvitationResult);

        if ($row) {
            $response["valid"] = true;
        } else {
            $response["valid"] = false;
            $response["error"] = "Invitation code not found";
        }
    } else {
        $response["valid"] = false;
        $response["error"] = mysqli_error($conn);
    }
}

// Output the JSON response
echo json_encode($response);
?>
