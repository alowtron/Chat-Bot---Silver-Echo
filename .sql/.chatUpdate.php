<?php
session_start();
require_once "../config.php";

// Retrieve data from POST request
$chatId = $_POST['chatId'];
$newChatText = $_POST['entireChat'];
$memory = $_POST['memory'];
$systemPrompt = $_POST['systemPrompt'];
$userId = $_SESSION["id"];

// Prepare the SQL statement to update chat_text, chat_memory, and last_modified
$sql = "UPDATE chats SET chat_text = ?, chat_memory = ?, system_prompt = ?, last_modified = NOW() WHERE chat_id = ? AND id = ?";

// Prepare the statement
$stmt = $link->prepare($sql);
if ($stmt === false) {
    // Error preparing the statement
    die("Error preparing the SQL statement: " . $link->error);
}

// Bind parameters to the statement
$bindResult = $stmt->bind_param("sssii", $newChatText, $memory, $systemPrompt, $chatId, $userId);
if ($bindResult === false) {
    // Error binding parameters
    $stmt->close();
    die("Error binding parameters to the SQL statement: " . $stmt->error);
}

// Execute the statement
$executeResult = $stmt->execute();
if ($executeResult === false) {
    // Error executing the statement
    $stmt->close();
    die("Error executing the SQL statement: " . $stmt->error);
}

// Close the statement
$stmt->close();

// Return success message or any other response
echo "Chat text and memory updated successfully!";

