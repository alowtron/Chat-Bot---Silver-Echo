<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Silver Echo</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="media/logo.png">
    
    <?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: account/login.php');
    exit;
}
?>


</head>
<body>
    
<main>
    <div class="grid">
        <div class="left" id="left">
            <div class="account">
                <a href="account/logout.php">Logout</a>
                <br>
                <a href="account/reset-password.php">Reset Password</a>
                <br>
            </div>
            <label for="voiceDropdown">Select a voice:</label>
            <select id="voiceDropdown">
                <!-- Options will be populated dynamically using JavaScript -->
            </select>
            <div class="textToSpeechToggleContainer">
                <label for="textToSpeechToggle">Text to Speech</label>
                <br>
                <input type="checkbox" id="textToSpeechToggle">
            </div>
            <h3>
                Advance Options
            </h3>
            <label for="temperature">Temperature(0-2)</label>
            <br>
            <input type="input" id="temperature" placeholder="Temperature" min="0" max="2" step="0.1" value="0.7">
            <br>
            <label for="repetitionPenalty">Repetition Penalty(1-2)</label>
            <br>
            <input type="input" id="repetitionPenalty" placeholder="Repetition Penalty 1 - 2" min="1" max="2" value="1">
            <br>
            <label for="systemPrompt">System Prompt</label>
            <br>
            <textarea id="systemPrompt" placeholder="System Prompt"></textarea>
            <br>
            <label for="modelSelect">Model</label>
            <br>
            <select id="modelSelect">
                <option value="mistralai/Mixtral-8x7B-Instruct-v0.1">Mixtral-8x7B</option>
                <option value="deepseek-ai/deepseek-coder-33b-instruct">DeepSeek Coder</option>
                <option value="Qwen/Qwen1.5-14B-Chat">Qwen 14B</option>
            </select>
        
            <h3>
                Chats
            </h3>
            <button class="newChat" onclick="newChat()">New Chat</button>
            <h3>
                Chat History
            </h3>
            <div class="pastChatsContainer" id="pastChatsContainer">
                
            </div>
        </div>
        
        <div class="talkBox">
            <!-- Chat Display Here -->
            <div class="output" id="output">
    
            </div>
            
            <!-- Chat input goes here -->
    
            
            <div class="input">
                <textarea placeholder="Type to chat, shift + enter for new line" rows="1" class="inputBox" id="inputBox"></textarea>
                <!-- Mic toggle button -->
                <img src="media/mic_off_icon.png" alt="Mic Icon" class="micToggle" id="micToggle" onmouseenter="micHover()" onmouseout="micLeaveHover()" onclick="micToggle()">
                <!-- Send button -->
                <img alt="send icon" src="media/send.png" class="sendButton" id="sendButton" onmouseenter="sendHover()" onmouseout="sendLeaveHover()" onclick="sendMessage()">
            </div>
            
        </div>
        

    </div>
    <div id="lowerContent">
    
    </div>
    
</main>
<script src="visuals.js"></script>
<script src="tts-stt.js"></script>
<script src="main.js"></script>

    
</script>
</body>
</html>