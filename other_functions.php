<?php
include 'db.php';

function determineCPAForEducation($educationId, $conn) {
    try {
        // Use a transaction to ensure consistency
        $conn->begin_transaction();

        // Find an available CPA with assigned_task set to 0
        $querySelectCPA = "SELECT cpa_id FROM cpa WHERE assigned_task = 0";
        $resultSelectCPA = $conn->query($querySelectCPA);

        // Check for errors in the SELECT query
        if (!$resultSelectCPA) {
            throw new Exception("Error in SELECT query: " . $conn->error);
        }
        echo($resultSelectCPA->num_rows);
        // Check if a CPA is available
        if ($resultSelectCPA->num_rows > 0) {
            
            while ($row = $resultSelectCPA->fetch_assoc()) {
                // Access the 'cpa_id' value from the row
                $cpaId = $row['cpa_id'];

                // Do something with $cpaId
                

                // Update the cpa table to mark as assigned
                $queryUpdateCPA = "UPDATE cpa SET assigned_task = 1 WHERE cpa_id = ?";
                $stmtUpdateCPA = $conn->prepare($queryUpdateCPA);

                // Check for errors in the UPDATE prepare statement
                if (!$stmtUpdateCPA) {
                    throw new Exception("Error in UPDATE prepare statement: " . $conn->error);
                }

                $stmtUpdateCPA->bind_param('i', $cpaId);
                $stmtUpdateCPA->execute();

                // Check for errors in the UPDATE execution
                if ($stmtUpdateCPA->error) {
                    throw new Exception("Error in UPDATE execution: " . $stmtUpdateCPA->error);
                }

                // Commit the transaction
                $conn->commit();
                echo "CPA ID: " . $cpaId;
                return $cpaId;
            }
        } else {
            // No available CPAs found
            $conn->rollback(); // Rollback the transaction
            echo '{"error":"available CPA found"}';
            return null;
        }
    } catch (Exception $e) {
    error_log('Error in determineCPAForEducation: ' . $e->getMessage());
    $conn->rollback(); // Rollback the transaction in case of an error
    echo '{"error":"Database error"}';
    return null;
    }
}
?>
