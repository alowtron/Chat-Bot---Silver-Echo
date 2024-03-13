/* This js file needs to load after the html for everything to work properly*/

// Define msg var in global scope for text to speech
let msg

// SendMessage function
function sendMessage() {
    let message = document.getElementById('inputBox').value
    let repetitionPenalty = parseFloat(document.getElementById("repetitionPenalty").value)
    let temperature = parseFloat(document.getElementById("temperature").value)
    document.getElementById("inputBox").value = ""
    document.getElementById("output").innerHTML += `
    <div class="userMessageContainer">
        <div class="userName">
            You
        </div>
        <div class="userMessage">
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
    fetch('chatbot.php', {
        method: 'POST',
        body: allData
    })
    .then(response => response.text())
    .then(processedData => {
        console.log(processedData)

        let displayMessage = JSON.parse(processedData);
        let displayMessageText =  displayMessage.choices[0].message.content.replace(/\n/g, "<br>")

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
        manageMemory(message, displayMessageText)
        if (document.getElementById("textToSpeechToggle").checked) {
            speakBotMessage(displayMessageText)
        }

    })
    .catch(error => {
        console.log(error)
    })
}
var memory = ""
function manageMemory(lastMessage, botMessage) {
    // let promptText = "Write the following information into your memory with as few words as possible, get rid of useless information, example, User: Name Charles, AI: offered to help.\n"
    let promptText = "Summarize the following information into a sentence.\n"
    // let promptInput = promptText + memory + "user message: " +lastMessage + "bot: " + botMessage
    if (memory.length > 3000) {
        let memoryChangeText = "Rewrite this will all of the unimportant information removed."
        let allData = new FormData()
        allData.append("memoryChangeText", memoryChangeText)
        fetch('memory.php', {
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
    fetch('memory.php', {
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


// Code to select voice

// Define the voices variable outside of any function so it's accessible globally
let voices = []

// Function to populate dropdown menu with voices
function populateVoiceDropdown() {
    if (voiceDropdown.length === 0) {// check if voices are already populated
        voices = window.speechSynthesis.getVoices()
        let voiceDropdown = document.getElementById('voiceDropdown')
        
        // Clear existing options
        voiceDropdown.innerHTML = ''

        // Populate dropdown menu with voices
        
        voices.forEach(function(voice, index) {
            let option = document.createElement('option')
            option.value = index
            option.textContent = voice.name
            voiceDropdown.appendChild(option)
        })
        let numberOfVoices = voices.length
        if (numberOfVoices > 300) {
            voiceDropdown.selectedIndex = 99; // Set the selected index to 150
        }
    }
}

// Event listener for voiceschanged event
window.speechSynthesis.onvoiceschanged = populateVoiceDropdown;

// Function to speak the bot message with the selected voice
function speakBotMessage(text) {
    if (!msg) {
        // If msg is not defined, create a new SpeechSynthesisUtterance object
        msg = new SpeechSynthesisUtterance()
    }
    text = text.replace(/<br>/g, "")
    msg.text = text
    

    let selectedVoiceIndex = document.getElementById('voiceDropdown').value
    msg.voice = window.speechSynthesis.getVoices()[selectedVoiceIndex]

    window.speechSynthesis.speak(msg)
    console.log('speakBotMessage')
}


// Event listener for voice selection
voiceDropdown.addEventListener('change', () => {
    let selectedVoiceIndex = this.value
    let selectedVoice = voices[selectedVoiceIndex]
    
    // Set the selected voice to the SpeechSynthesisUtterance object
    if (!msg) {
        msg = new SpeechSynthesisUtterance()
    }
    msg.voice = selectedVoice
    console.log('changeVoice')
})



// Code to make textarea change size as more text is added
// select the inputBox
let textarea = document.getElementById("inputBox")
// code to update the height
function updateSize() {
    let desiredHeight = Math.min(textarea.scrollHeight, 200)
    // make the input box grow as more text is added
    textarea.style.height = desiredHeight + 'px'
}
// wait for input
textarea.addEventListener('input', () => {
    updateSize()
    // make the input box shrink as text is taken away.
    textarea.addEventListener('keydown', (event) => {
        if (event.key === "Backspace" && textarea.scrollHeight > 0) {
            textarea.style.height = '24px'

        }
    })
})

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

// update the size of inputBox every second so that it resizes while using text to speech
setInterval(updateSize, 1000)

// Code for toggling on and off mic
// keeps track if mic is active or not
let micActive = false
// initializes speech var for use in {micStart()} and {micStop()}
let speech
// is called every time that mic button is pressed
function micToggle() {
    // starts the mic
    if (micActive == false) {
        micStart()
        micActive = true
        // changes the mic image
        document.getElementById("micToggle").src = "media/mic_icon.png"
    } else {
        // stops the mic
        micStop()
        micActive = false
        // changes the mic image
        document.getElementById("micToggle").src = "media/mic_off_icon.png"
    }
}

function micStart() {
    // creates a speech recognition instance
    speech = new webkitSpeechRecognition() || new SpeechRecognition()
    speech.continuous = true
    speech.lang = 'en-US'

    // returns the results of what is said into input box
    speech.onresult = function(event) {
        const lastResultIndex = event.results.length - 1
        const transcript = event.results[lastResultIndex][0].transcript
        
        // checks to see if the word "send message" is in the transcript
        if (transcript.toLowerCase().includes("send message".toLowerCase())) {
            // removes the phrase "send message" from the transcript
            let newTranscript = transcript.replace("send message", "").trim()
            
            // adds input to input box without send message
            document.getElementById("inputBox").value += newTranscript
            // sends the message
            sendMessage()

            // clears the input box
            document.getElementById("inputBox").value = ""
        } else {
            // adds the transcript to the input box
            document.getElementById("inputBox").value += transcript
            document.getElementById("inputBox").value += " "
        }
    }

    // starts the speech
    speech.start()
    console.log("Speech Started")
}

// stops mic
function micStop() {
    if (speech) {
        speech.stop()
    }
    console.log("Speech Stopped")
    return micActive
}

// Code for changing images of icons
function micHover() {
    if (document.getElementById("micToggle").src.endsWith("mic_off_icon.png")) {
        document.getElementById("micToggle").src = "media/mic_off_icon_hover.png"
    } else {
        document.getElementById("micToggle").src = "media/mic_icon_hover.png"
    }
}

function micLeaveHover() {
    if (document.getElementById("micToggle").src.endsWith("mic_off_icon_hover.png") || document.getElementById("micToggle").src.endsWith("mic_off_icon.png")) {
        document.getElementById("micToggle").src = "media/mic_off_icon.png"
    } else {
        document.getElementById("micToggle").src = "media/mic_icon.png"
    }
}

function sendHover() {
    if (document.getElementById("sendButton").src.endsWith("send.png")) {
        document.getElementById("sendButton").src = "media/send_hover.png"
    }
}

function sendLeaveHover() {
    if (document.getElementById("sendButton").src.endsWith("send_hover.png")) {
        document.getElementById("sendButton").src = "media/send.png"
    }
}

