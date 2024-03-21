<?php
require_once "config.php";


session_start();


// create sql statement to use later
$sql = "SELECT chat_id FROM chats WHERE id = ?";

// get the users id
$userId = $_SESSION["id"];

// prepare the statement
$stmt = mysqli_prepare($link, $sql);

// bind the parameters
mysqli_stmt_bind_param($stmt, "i", $userId);

// execute the statement
mysqli_stmt_execute($stmt);

//return the data
$result = mysqli_stmt_get_result($stmt);

// initialize an array to store chats
$chats = array();

// fetch rows and add them to the chats array
while ($row = mysqli_fetch_assoc($result)) {
    $chats[] = $row;
}

// close statement
mysqli_stmt_close($stmt);

// close connection
mysqli_close($link);

// convert chats array to JSON
$chats_json = json_encode($chats);

// set appropriate headers to indicate JSON content
header('Content-Type: application/json');

// output the JSON data
echo $chats_json;