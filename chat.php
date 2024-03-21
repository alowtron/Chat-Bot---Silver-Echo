<?php
session_start();
require_once "config.php";

$entireChat = $_POST['entireChat'];

$userId = $_SESSION["id"];

// Prepare the SQL statement to be executed
$sql = "INSERT INTO chats (id, chat_text, last_modified) VALUES (?, ?, NOW())";


// Prepare the statement
$stmt = $link->prepare($sql);
if ($stmt === false) {
    // Error preparing the statement. Die will terminate the script and generate a server error
    die("Error preparing the SQL statement: " . $conn->error);
}

// Bind the parameters to the statement
$bindResult = $stmt->bind_param("is", $userId, $entireChat);
if ($bindResult === false) {
    // Error binding the parameters. Close the statement and generate a server error
    $stmt->close();
    die("Error binding parameters to the SQL statement: " . $stmt->error);
}

// Execute the statement
$executeResult = $stmt->execute();
if ($executeResult === false) {
    // Error executing the statement. Close the statement and generate a server error
    $stmt->close();
    die("Error executing the SQL statement: " . $stmt->error);
}

// Close the statement
$stmt->close();

