

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

// update the size of inputBox every second so that it resizes while using text to speech
setInterval(updateSize, 1000)

// Code to change the layout for mobile
if (window.innerWidth < 800) {
    let lowerContent = document.getElementById("left")
    // document.write(lowerContent.innerHTML)
    document.getElementById("lowerContent").innerHTML = lowerContent.innerHTML
    document.getElementById("left").innerHTML = ""
}