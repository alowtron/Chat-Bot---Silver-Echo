/* This js file needs to load after the html for everything to work properly*/

// SendMessage
function sendMessage() {
    let message = document.getElementById('inputBox').value
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
    let allData = new FormData()
    allData.append("message", message)
    fetch('chatbot.php', {
        method: 'POST',
        body: allData
    })
    .then(response => response.text())
    .then(processedData => {
        console.log(processedData)

        let displayMessage = JSON.parse(processedData)
        let displayMessageText =  displayMessage.choices[0].message.content.replace(/\n/g, "<br>")

        document.getElementById("output").innerHTML += `
        <div class="botMessageContainer">
            <div class="botName">
                Bot
            </div>
            <div class="botMessage">
                ${displayMessageText}
            </div>
        </div>
        `
        // scroll to the bottom after message is submitted
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight
    })
    .catch(error => {
        console.log(error)
    })

    
}
// ${displayMessage.choices[0].message.content}



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
            textarea.style.height = (textarea.scrollHeight - 20) + 'px'
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
        document.getElementById("inputBox").value += transcript
        document.getElementById("inputBox").value += " "
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

