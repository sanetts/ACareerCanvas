<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php'; // Include your database connection file

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Collect JSON data from the request body
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data);

    // Validate and sanitize the data (you might need to improve this based on your requirements)
    $email = mysqli_real_escape_string($conn, $data->email);
    $password = mysqli_real_escape_string($conn, $data->password);
    $userRole = mysqli_real_escape_string($conn, $data->role);

    // Query to check if the user exists with the provided email
    $sql = "SELECT * FROM student WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashedPassword = $row['password_hash'];
        $dbUserRole = $row['role']; 
        
        // Check if the provided role matches the stored role
        if ($userRole === $dbUserRole) {
            // Check if the provided password matches the stored hashed password
            if (password_verify($password, $hashedPassword)) {
                // Passwords match, login successful
                $student_id = $row['student_id'];
                echo json_encode(array("message" => "Logged in", "student_id" => $student_id, "role" => $userRole));
            } else {
                // Passwords do not match, login failed
                echo json_encode(array("error" => "Invalid password"));
            }
        } else {
            // Roles do not match, login failed
            echo json_encode(array("error" => "Role does not match"));
        }
    } else {
        // User not found, login failed
        echo json_encode(array("error" => "User not found"));
    }
} else {
    // Invalid request method
    echo json_encode(array("error" => "Invalid request method"));
}

// Close the database connection
$conn->close();
?>
