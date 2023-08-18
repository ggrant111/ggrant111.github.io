document
  .getElementById("randFact")
  .addEventListener("click", getFactWithDelay);
document.getElementById("sound").addEventListener("click", playRandomSound);
document.getElementById("speakButton").addEventListener("click", speakText);
document.getElementById("close").addEventListener("click", hideSplashScreen);
var wrapper = document.querySelector(".splash-screen svg");
const cancelButton = document.getElementById("closeHelp");
document.getElementById("help").addEventListener("click", myFunction);

function toggleActive() {
  mainImage.classList.add("active");

  // Remove the class after 3 seconds
  setTimeout(() => {
    mainImage.classList.remove("active");
  }, 3000); // 3000 milliseconds = 3 seconds
}

function myFunction() {
  document.getElementById("popup").showModal();
  console.log("modal show");
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
async function getFactWithDelay() {
    try {
      let contentElement = document.getElementById("content");
      contentElement.textContent =
        "Summoning a fascinating fact from the depths of knowledge...";
  
      await new Promise((resolve) => setTimeout(resolve, 2250)); // Delay of 2.5 seconds
  
      let limit = 1; // Number of facts you want to retrieve         
      let response = await fetch(`https://api.api-ninjas.com/v1/facts?limit=${limit}`, {
        headers: {
          'X-Api-Key': 'a8HBXjt3XhMPb3ZyWLI6Eg==WcJXpURGwXNC49ps'
        }
      });
  
      if (response.ok) {
        let factResponse = await response.json();
  
        if (factResponse && Array.isArray(factResponse) && factResponse.length > 0) {
          let fact = factResponse[0].fact; 
          contentElement.textContent = fact;
          contentElement.classList.add("custom-font"); // Adding the class
          console.log(fact);
        } else {
          contentElement.textContent = "Failed to retrieve fact.";
        }
      } else {
        contentElement.textContent = "Failed to retrieve fact. Status: " + response.status;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  
  
  
  

// Get a reference to the audio element
var audioElement = document.getElementById("sound5");

// Get a reference to the button element
var playButton = document.getElementById("randFact");

// Add a click event listener to the button
playButton.addEventListener("click", function() {
    audioElement.volume = 0.15;
    // Play the audio
    audioElement.play();
});

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
  html2canvas(contentElement).then(function (canvas) {
    // Convert the canvas to a data URL representing the image
    const dataURL = canvas.toDataURL();

    // Create a link to download the im
    const link = document.createElement("a");
    link.download = "punny_pop_content.png"; // Set the filename for the downloaded image
    link.href = dataURL;
    link.click();
  });
}

function screenshot() {
  html2canvas(document.getElementById("content")).then(function (canvas) {
    document.body.appendChild(canvas);
  });
}

// Function to send the joke to a friend
function sendJokeToFriend() {
  const contentText = document.getElementById("content").textContent;
  const webSiteURL = "ggrant111.github.io";

  // Check if the Web Share API is supported by the browser
  if (navigator.canShare && navigator.share) {
    navigator
      .share({
        title: "Check out this joke!",
        text: contentText + "\n\n" + "--sent from " + webSiteURL,
      })
      .then(() => console.log("Joke shared successfully"))
      .catch((error) => console.error("Error sharing joke:", error));
  } else {
    // Provide a fallback option for browsers that do not support the Web Share API
    console.log("Web Share API not supported");
    // You can display an alert or provide an alternative sharing method here.
  }
}


