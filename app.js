document.getElementById("randJoke").addEventListener("click", joke);
document.getElementById("sound").addEventListener("click", playRandomSound);
document.getElementById("speakButton").addEventListener("click", speakText);



async function joke() {
    let config = {
    headers: {
        Accept: "application/json",
        },
    };
    let a = await fetch("https://icanhazdadjoke.com/", config);
    let b = await a.json();
    document.getElementById("content").innerHTML = b.joke;
    console.log(b.joke);
}

// Function to play a random sound
function playRandomSound() {
    const randomIndex = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
    const sound = document.getElementById(`sound${randomIndex}`);
    sound.play();
}

// Function to convert content text to speech
function speakText() {
    const contentText = document.getElementById("content").textContent;
    if (contentText.trim() !== "") {
        const utterance = new SpeechSynthesisUtterance(contentText);
        speechSynthesis.speak(utterance);
    }
}

// Function to convert content text to speech
function speakText() {
    const contentText = document.getElementById("content").textContent;
    if (contentText.trim() !== "") {
        const utterance = new SpeechSynthesisUtterance(contentText);
        speechSynthesis.speak(utterance);
    }
}

// Function to share the content as an image
function shareContentAsImage() {
    // Select the content element to be captured
    const contentElement = document.getElementById("content");

    // Use html2canvas to capture the content element and create an image
    html2canvas(contentElement).then(function(canvas) {
        // Convert the canvas to a data URL representing the image
        const dataURL = canvas.toDataURL();

        // Create a link to download the im
        const link = document.createElement("a");
        link.download = "punny_pop_content.png"; // Set the filename for the downloaded image
        link.href = dataURL;
        link.click();
    });
}


function screenshot(){
    html2canvas(document.getElementById('content')).then(function(canvas) {
       document.body.appendChild(canvas);
    });
 }
    

function goToSettingsPage() {
    // Use window.location.href to navigate to the settings.html page
    window.location.href = "settings.html";
}

function goToHomePage() {
    // Use window.location.href to navigate to the index.html page
    window.location.href = "index.html";
}