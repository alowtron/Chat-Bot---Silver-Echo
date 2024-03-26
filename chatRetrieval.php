<?php
require_once "config.php";
session_start();

// Check if the user is logged in
if(isset($_SESSION['id'])) {
    // Get the user's ID
    $userId = $_SESSION["id"];

    // Create SQL statement
    $sql = "SELECT * FROM chats WHERE id = ?";

    // Prepare the statement
    $stmt = mysqli_prepare($link, $sql);

    // Bind the parameters
    mysqli_stmt_bind_param($stmt, "i", $userId);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Initialize an array to store chats
    $chats = array();

    // Fetch rows and add them to the chats array
    while ($row = mysqli_fetch_assoc($result)) {
        $chats[] = $row;
    }

    // Close statement
    mysqli_stmt_close($stmt);

    // Close connection
    mysqli_close($link);

    // Convert chats array to JSON
    $chats_json = json_encode($chats);

    // Set appropriate headers to indicate JSON content
    header('Content-Type: application/json');

    // Output the JSON data
    echo $chats_json;
} else {
    // If user is not logged in, return an error message
    echo json_encode(array("error" => "User not logged in"));
}
?>
