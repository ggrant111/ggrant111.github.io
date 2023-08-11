document.getElementById("randJoke").addEventListener("click", joke);
document.getElementById("sound").addEventListener("click", playRandomSound);
document.getElementById("speakButton").addEventListener("click", speakText);
var wrapper = document.querySelector('.splash-screen svg')
const cancelButton = document.getElementById("closeHelp");
// document.getElementById("splashScreen").addEventListener("click" , splashScreen.style.visibility = "hidden");


function myFunction() { 
  document.getElementById("popup").showModal(); 
  console.log("modal show")
} 

cancelButton.addEventListener("click", () => {
    popup.close();
});

// Function to hide the splash screen with fade-out effect
function hideSplashScreen() {
    const splashScreen = document.getElementById("splashScreen");
    splashScreen.style.opacity = "0"; // Apply fade-out effect
    setTimeout(() => {
        splashScreen.style.display = "none"; // Hide the splash screen
    }, 1000); // Wait for the fade-out transition duration (in milliseconds)
}

// Check if the splash screen has been shown before in this session
const splashShown = sessionStorage.getItem("splashShown");

// If the splash screen hasn't been shown, display it
if (!splashShown) {
    const splashScreen = document.getElementById("splashScreen");
    splashScreen.style.display = "";
    setTimeout(hideSplashScreen, 6000); // Set a timeout to hide after 3 seconds

    // Set a flag in session storage to indicate that the splash screen has been shown
    sessionStorage.setItem("splashShown", true);
}



function draw() {
    wrapper.classList.add('active')
  }


  async function joke() {
    try {
        let response = await axios.get("https://insult.mattbas.org/api/insult.json");
        let data = response.data;
        document.getElementById("content").innerHTML = data.joke;
        console.log(data.joke);
    } catch (error) {
        console.error("An error occurred:", error);
    }
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
    

// Function to send the joke to a friend
function sendJokeToFriend() {
    const contentText = document.getElementById("content").textContent;
    const webSiteURL = 'ggrant111.github.io';

    // Check if the Web Share API is supported by the browser
    if (navigator.canShare && navigator.share) {
        navigator.share({
            title: "Check out this joke!",
            text: contentText + '\n\n' + "--sent from " + webSiteURL,
        })
        .then(() => console.log("Joke shared successfully"))
        .catch((error) => console.error("Error sharing joke:", error));
    } else {
        // Provide a fallback option for browsers that do not support the Web Share API
        console.log("Web Share API not supported");
        // You can display an alert or provide an alternative sharing method here.
    }
}

window.onload = draw; 