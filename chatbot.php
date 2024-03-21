<?php
// Include config file
require_once "config.php";

// Function to get user credits by ID
function getUserCredits($userID) {
    global $link;
    
    $credits = 0;
    
    $sql = "SELECT credits FROM users WHERE id = ?";
    
    if($stmt = mysqli_prepare($link, $sql)){
        // Bind variables to the prepared statement as parameters
        mysqli_stmt_bind_param($stmt, "i", $param_id);
        
        // Set parameters
        $param_id = $userID;
        
        // Attempt to execute the prepared statement
        if(mysqli_stmt_execute($stmt)){
            // Store result
            mysqli_stmt_store_result($stmt);
            
            // Check if user exists
            if(mysqli_stmt_num_rows($stmt) == 1){                    
                // Bind result variables
                mysqli_stmt_bind_result($stmt, $credits);
                if(mysqli_stmt_fetch($stmt)){
                    return $credits;
                }
            } else{
                return false;
            }
        } else{
            return false;
        }

        // Close statement
        mysqli_stmt_close($stmt);
    }
}

// Check if user is logged in
session_start();
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    // Get user ID from session
    $userID = $_SESSION["id"];
    
    // Get user credits
    $userCredits = getUserCredits($userID);
    
    // Check if user has enough credits
    if($userCredits >= 1){
        // Subtract one credit
        $userCredits--;
        
        // Prepare an update statement to decrement user credits
        $sql = "UPDATE users SET credits = ? WHERE id = ?";
        
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ii", $userCredits, $userID);
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                // Close statement
                mysqli_stmt_close($stmt);
                
                // Proceed with chat completion request
                // get message data
                $message = $_POST['message'];
                $repetitionPenalty = floatval($_POST['repetitionPenalty']);
                $temperature = floatval($_POST['temperature']);
                $pastMessages = $_POST['pastMessages'];
                $systemPrompt = $_POST['systemPrompt'];
                $modelSelect = $_POST['modelSelect'];

                $curl = curl_init();

                curl_setopt_array($curl, [
                  CURLOPT_URL => "https://api.together.xyz/v1/chat/completions",
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "POST",
                  CURLOPT_POSTFIELDS => json_encode([
                    'model' => $modelSelect,
                    'stop' => [
                        '</s>'
                    ],
                    'repetition_penalty' => $repetitionPenalty,
                    'temperature' => $temperature,

                    // set max tokens later
                    'messages' => [
                      [
                        'role' => 'system',
                        'content' => $systemPrompt
                      ],
                      [
                        'role' => 'system',
                        'content' => $pastMessages
                      ],
                      [
                        'role' => 'user',
                        'content' => $message
                      ]
                    ]
                  ]),
                  CURLOPT_HTTPHEADER => [
                    "Authorization: Bearer ",
                    "accept: application/json",
                    "content-type: application/json"
                  ],
                ]);

                $response = curl_exec($curl);
                $err = curl_error($curl);

                curl_close($curl);

                if ($err) {
                  echo "cURL Error #:" . $err;
                } else {
                  echo $response;
                }
            } else{
                echo "Oops! Something went wrong while updating user credits.";
            }
        }
    } else {
        echo "Insufficient credits. Please purchase more credits.";
    }
} else {
    echo "User is not logged in.";
}
