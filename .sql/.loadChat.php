<?php
require_once "../config.php";
session_start();

// Check if the chat_id and user_id are set in the POST data
if(isset($_POST['chat_id']) && isset($_SESSION['id'])) {
    // Get the chat ID and user ID
    $chatId = $_POST['chat_id'];
    $userId = $_SESSION["id"];

    // Create SQL statement
    $sql = "SELECT * FROM chats WHERE chat_id = ? AND id = ?";

    // Prepare the statement
    $stmt = mysqli_prepare($link, $sql);

    // Bind parameters
    mysqli_stmt_bind_param($stmt, "ii", $chatId, $userId);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Fetch the row as an associative array
    $row = mysqli_fetch_assoc($result);

    // Close statement
    mysqli_stmt_close($stmt);

    // Close connection
    mysqli_close($link);

    // Check if a row was found
    if($row) {
        // Output the row data as JSON
        echo json_encode($row);
    } else {
        // If no row found, return an error message
        echo json_encode(array("error" => "No chat found with the provided ID for the current user"));
    }
} else {
    // If chat_id or user_id is not set in POST data, return an error message
    echo json_encode(array("error" => "Chat ID or User ID not provided"));
}
?>
