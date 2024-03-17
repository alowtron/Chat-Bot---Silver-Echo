<?php
// get information from database
require_once "config.php";
$user_id = $_POST['user_id'];
$sql = "SELECT credits FROM users WHERE id = ?";

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
