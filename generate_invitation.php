<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

include 'db.php';
require 'phpmailer/phpmailer/src/Exception.php';
require 'phpmailer/phpmailer/src/PHPMailer.php';
require 'phpmailer/phpmailer/src/SMTP.php';
var_dump("Reached here");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    echo json_encode(array("error" => "Starting"));
    // Collect JSON data from the request body
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data);

    if ($data === null) {
        echo json_encode(array("error" => "Invalid JSON data"));
        exit;
    }

    $email = mysqli_real_escape_string($conn, $data->email);
    $invitationCode = generateInvitationCode();
    echo json_encode(array("email" =>$email));
    echo json_encode(array("code" =>$invitationCode));

    // Insert the data into the 'invitations' table
    $sql = "INSERT INTO invitations (email, code) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $invitationCode);

    if ($stmt->execute()) {
       
        $mail = new PHPMailer(true);
        var_dump("Reached mailer");
        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; 
            $mail->SMTPAuth   = true;
            $mail->Username   = 's.nettey.2002@gmail.com'; 
            $mail->Password   = 'eaotdjrrxkfnasfv'; 
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = 465;
            var_dump("PHP Mailer");
            //Recipients
            $mail->setFrom('s.nettey.2002@gmail.com'); // Replace with your email and name
            $mail->addAddress($email);

            //Content
            $mail->isHTML(true);
            $mail->Subject = 'Invitation Code for CareerCanvas';
            $mail->Body    = "Your CareerCanvas invitation code is: $invitationCode";

            $mail->send();

            echo json_encode(array("invitationCode" => $invitationCode));


            // Insert the data into the 'invitations' table
            //$sql = "INSERT INTO invitations (email, code) VALUES (?, ?)";
            //$stmt = $conn->prepare($sql);
            //$stmt->bind_param("ss", $email, $invitationCode);
            
        } catch (Exception $e) {
            echo json_encode(array("error" => "Error sending invitation email: " . $mail->ErrorInfo));
            echo json_encode(array("Not sent " => $e));
        }
        } else {
        echo json_encode(array("error" => "Error creating invitation: " . $stmt->error));
        }
        $stmt->close();

        } else {
    echo json_encode(array("error" => "Invalid request method"));
}




// Close the database connection
$conn->close();

// Function to generate a random invitation code
function generateInvitationCode()
{
    return bin2hex(random_bytes(6));
}
?>
