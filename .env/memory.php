<?php
// get message data
$prompt = $_POST['prompt'];



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
    'model' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'stop' => [
        '</s>'
    ],
    'messages' => [
        [
                'role' => 'user',
                'content' => $prompt 
        ]
    ]
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer 342d921e6ba8b5a9eb380e5e8b6d7f3bf8955534166c66a2f8b0fbf961e497ac",
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
