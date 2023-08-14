document
  .getElementById("randJoke")
  .addEventListener("click", getInsultWithDelay);
document.getElementById("sound").addEventListener("click", playRandomSound);
document.getElementById("speakButton").addEventListener("click", speakText);
document.getElementById("close").addEventListener("click", hideSplashScreen);
var wrapper = document.querySelector(".splash-screen svg");
const cancelButton = document.getElementById("closeHelp");
const spin = document.getElementById("randJoke");
spin.addEventListener("click", toggleActive);
// document.getElementById("splashScreen").addEventListener("click" , splashScreen.style.visibility = "hidden");

// Replace with your JSON URL
var animationDataUrl =
  "https://lottie.host/9357dc98-b5fb-431b-bbb6-01768a9bb854/uiwIcRycrE.json";

var animationContainer = document.getElementById("mainImage");

// // Load the animation
// var anim = lottie.loadAnimation({
//   container: animationContainer,
//   renderer: "svg", // You can choose "canvas" or "html" here
//   loop: true,
//   autoplay: true,
//   path: animationDataUrl,
// });

// // Adjust the speed of the animation (1 is the default speed)
// anim.setSpeed(0.25); // Change the value to adjust the speed (0.5 is half speed)

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

// function draw() {
//     wrapper.classList.add('active')
//   }

// async function getInsult() {
//   try {
//     let response = await fetch("https://insult.mattbas.org/api/insult.txt");
//     let insult = await response.text();
//     document.getElementById("content").textContent = insult;
//     console.log(insult);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

async function getInsultWithDelay() {
  try {
    let contentElement = document.getElementById("content");
    contentElement.textContent =
      "Let's see what creative insult fate has in store for you!";

    await new Promise((resolve) => setTimeout(resolve, 2500)); // Delay of 2.5 seconds

    let response = await fetch("https://insult.mattbas.org/api/insult.txt");
    let insult = await response.text();
    contentElement.textContent = insult;
    console.log(insult);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// getInsult();

// getInsult();

// async function joke() {
//     let config = {
//     headers: {
//         Accept: "application/json",
//         language: "en",
//         },
//     };

//     let a = await fetch("https://evilinsult.com/generate_insult.php");
//     let b = await a.json();
//     document.getElementById("content").innerHTML = b.insult;
//     console.log(b.insult);
//     console.log(b.joke);
// }

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

// window.onload = draw;
