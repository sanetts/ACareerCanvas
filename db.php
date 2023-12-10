<?php

$servername = "localhost"; // Change this if your database is on a different server
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "CareerCanvas"; // Your MySQL database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>