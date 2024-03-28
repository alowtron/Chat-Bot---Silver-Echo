/* This js file needs to load after the html for everything to work properly*/
var pastChatsVar = {

}
var currentChatId
// Define msg var in global scope for text to speech
let msg
var memory = ""


// SendMessage function
async function sendMessage() {
    // check to see if there is a message in input box
    let newMessageSent = false
    if (document.getElementById("output").textContent == "" || document.getElementById("output").textContent == '') {
        newMessageSent = true
    }
    
    let message = document.getElementById('inputBox').value
    let repetitionPenalty = parseFloat(document.getElementById("repetitionPenalty").value)
    let temperature = parseFloat(document.getElementById("temperature").value)
    document.getElementById("inputBox").value = ""
    document.getElementById("output").innerHTML += `
    <div class="userMessageContainer">
        <div class="userName">
            You
        </div>
        <div class="userMessage" id="userMessage">
            ${message}
        </div>
    </div>
    `

    console.log(message)
    // send and get response from llm
    // last messages sent
    let pastMessages = document.getElementById("output").innerHTML
    pastMessages = pastMessages.replace(/<p>/g, "")
    pastMessages = pastMessages.replace(/<div[^>]*>|\s*<\/div>/g, "")
    pastMessages = pastMessages.replace(/[\n\r]/g, "")
    pastMessages = pastMessages.replace(/\s{2,}/g, " ")


    // pastMessages = pastMessages.replace(/<(?!(?:userMessage|botMessage)[^>]*>).*?>/g, "")

    pastMessages = pastMessages.substring(Math.max(pastMessages.length - 4000, 0))
    pastMessages = "Most recent messages:" + pastMessages + "\n"
    console.log(pastMessages)
    // all information and most recent message
    let messageMemory = "Past information from all messages:" + memory + " Reply to this:" + message
    let allData = new FormData()
    
    allData.append("message", messageMemory)
    allData.append("repetitionPenalty", repetitionPenalty)
    allData.append("temperature", temperature)
    allData.append("pastMessages", pastMessages)
    allData.append("systemPrompt", document.getElementById("systemPrompt").value)
    allData.append("modelSelect", document.getElementById("modelSelect").value)
    await fetch('.api/.chatbot.php', {
        method: 'POST',
        body: allData
    })
    .then(response => response.text())
    .then(processedData => {
        console.log(processedData)

        let displayMessage = JSON.parse(processedData);
        let displayMessageText =  displayMessage.choices[0].message.content.replace(/\n/g, "<br>")
        displayMessageText = replaceCodeBlocks(displayMessageText)
        displayMessageText = replaceItalics(displayMessageText)

        document.getElementById("output").innerHTML += `
        <div class="botMessageContainer">
            <div class="botName">
                AI
            </div>
            <div class="botMessage">
                ${displayMessageText}
            </div>
        </div>
        `
        // scroll to the bottom after message is submitted
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight
        // Speak the bot message with the selected voice
        // check to see if text to speech is on
        
        if (document.getElementById("textToSpeechToggle").checked) {
            speakBotMessage(displayMessageText)
        }
        manageMemory(message, displayMessageText)
        .then(() => {
            // update sql
            let entireChat = document.getElementById("output").innerHTML
            let chatName = pastMessages.substring(25, 70)
            let systemPrompt = document.getElementById("systemPrompt").value
            if (newMessageSent == true) {
                allData = new FormData()
                allData.append("entireChat", entireChat)
                allData.append("chatName", chatName)
                allData.append("memory", memory)
                allData.append("systemPrompt", systemPrompt)
                fetch('.sql/.chat.php', {
                    method: 'POST',
                    body: allData
                })
                .then(response => 
                    console.log(response.text(),
                    console.log("entireChat")))
                    chatList()
                .catch(error => {
                    console.log(error)
                })
            } else {
                allData = new FormData()
                allData.append("entireChat", entireChat)
                allData.append("chatId", currentChatId)
                allData.append("memory", memory)
                allData.append("systemPrompt", systemPrompt)
                fetch('.sql/.chatUpdate.php', {
                    method: 'POST',
                    body: allData
                })
                .then(response =>
                    console.log(response.text(),
                    console.log("entireChat")))
                .catch(error => {
                    console.log(error)
                })
            }
        })
    })
    .catch(error => {
        console.log(error)
    })
    
    
    
    
}

async function manageMemory(lastMessage, botMessage) {
    // let promptText = "Write the following information into your memory with as few words as possible, get rid of useless information, example, User: Name Charles, AI: offered to help.\n"
    let promptText = "Summarize the following information into a sentence.\n"
    // let promptInput = promptText + memory + "user message: " +lastMessage + "bot: " + botMessage
    if (memory.length > 3000) {
        let memoryChangeText = "Rewrite this will all of the unimportant information removed."
        let allData = new FormData()
        allData.append("memoryChangeText", memoryChangeText)
        await fetch('.api/.memory.php', {
            method: 'POST',
            body: allData
        }).then(response => response.text())
        .then(processedData => {
            console.log(processedData)
            let memoryData = JSON.parse(processedData)
            memory = memoryData.choices[0].message.content
            console.log(memory)
        })
        .catch(error => {
            console.log(error)
        })
    }
    let promptInput = promptText + " User message: " + lastMessage + "\n AI message: " + botMessage
    console.log(promptInput)
    let allData = new FormData()
    allData.append("prompt", promptInput)
    await fetch('.api/.memory.php', {
        method: 'POST',
        body: allData
    })
    .then(response => response.text())
    .then(processedData => {
        console.log(processedData)
        let memoryData = JSON.parse(processedData)
        memory += memoryData.choices[0].message.content
        console.log(memory)
    })
    .catch(error => {
        console.log(error)
    })
}

// code to create a new chat
function newChat() {
    document.getElementById("output").innerHTML = ""
    document.getElementById("inputBox").value = ""
    msg = ""
    memory = ""
}

// code to display list of chat
async function chatList() {
    // Fetch data from chatRetrieval.php
    await fetch('.sql/.chatRetrieval.php')
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            
            // Parse the JSON response
            return response.json()
        })
        .then(data => {
            // Handle the retrieved data
            pastChatsVar = data
            document.getElementById("pastChatsContainer").innerHTML = ``
            for (let i = 0; i < pastChatsVar.length; i++) {
                
                document.getElementById("pastChatsContainer").innerHTML += `
                <div class="pastChat" id="pastChat" onclick="loadChat(${pastChatsVar[i].chat_id})">${pastChatsVar[i].chat_name}</div>
                `
            }
            console.log(data) // You can replace this with your actual logic to display the chat list
            return data
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error)
        })
}

// Code to load 
async function loadChat(chat_id) {
    console.log(chat_id)
    // Fetch data from chatRetrieval.php
    let allData = new FormData()
    allData.append("chat_id", chat_id)
    await fetch('.sql/.loadChat.php', {
        method: 'POST',
        body: allData
    })
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            console.log(data) 
            document.getElementById("output").innerHTML = data.chat_text
            currentChatId = data.chat_id
            memory = data.chat_memory
            document.getElementById("systemPrompt").value = data.system_prompt
            return data
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error)
        })
}

// Code to take and submit code when enter is pressed
// listen for enter to be pressed to submit message
textarea.addEventListener('keydown', (event) => {
    // checks to see if shift is pressed, if it is, does not submit
    if (event.key === 'Enter' && event.shiftKey === false) {
        // keeps enter from creating a new line
        event.preventDefault()
        sendMessage()
    }
})

// Function to replace triple backticks with HTML code markup
function replaceCodeBlocks(text) {
    // Replace code blocks (``` code ```)
    const codeBlockRegex = /```([\s\S]*?)```/g;
    text = text.replace(codeBlockRegex, '<pre><code>$1</code></pre>');

    // Replace inline code (`code`)
    const inlineCodeRegex = /`([^`]+)`/g;
    text = text.replace(inlineCodeRegex, '<code>$1</code>');

    return text;
}

// Function to replace text enclosed within asterisks with HTML italic markup
function replaceItalics(text) {
    const italicRegex = /\*([^*]+)\*/g;
    return text.replace(italicRegex, '<em>$1</em>');
}

newChat()
chatList()

console.log(pastChatsVar)