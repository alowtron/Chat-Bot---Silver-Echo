// This code takes and sends text to speech and text to speech

// Define the voices variable outside of any function so it's accessible globally
let voices = []

// Code for toggling on and off mic
// keeps track if mic is active or not
let micActive = false
// initializes speech var for use in {micStart()} and {micStop()}
let speech

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
            voiceDropdown.selectedIndex = 116
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