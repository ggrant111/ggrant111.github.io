// JavaScript for automatic scrolling
let currentSection = 0;
const totalSections = 5; // Update this with the actual number of sections you have

let voices = [];

function populateVoices() {
  voices = speechSynthesis.getVoices();
  console.log(voices);
  alert("Voices loaded: " + voices.length); // Debug: Alert the number of loaded voices
}

function setVoice() {
  populateVoices();
  if (!voices.length) {
    alert("No voices available."); // Debug: Alert if no voices are available
    return null;
  }

  const preferredVoice = "fem voice";
  const voiceFound = voices.find((voice) => voice.name === preferredVoice);

  if (voiceFound) {
    alert("Preferred voice found: " + voiceFound.name); // Debug: Alert the found voice
  } else {
    alert("Preferred voice not found. Defaulting to: " + voices[0].name); // Debug: Alert the default voice
  }

  return voiceFound || voices[0];
}

speechSynthesis.onvoiceschanged = populateVoices; // Trigger voice loading

// function speak(text) {
//   const voice = setVoice();
//   if (voice && text) {
//     let msg = new SpeechSynthesisUtterance();
//     msg.voice = voice;
//     msg.text = text;
//     msg.lang = "en-US";
//     speechSynthesis.speak(msg);
//   } else {
//     console.error("Either the voice isn't set, or there's no text to speak.");
//   }
// }

function speak(text) {
  // Fetch the available voices
  let voices = speechSynthesis.getVoices();

  // Create a new speech synthesis utterance
  let msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "en-US";

  // Set the voice to the first available one or leave it as default
  if (voices.length > 0) {
    msg.voice = voices[0]; // This sets the voice to the first one available
  }

  // Speak the text if it's provided
  if (text) {
    speechSynthesis.speak(msg);
  } else {
    console.error("There's no text to speak.");
  }
}

// Ensure the voices are loaded before speaking
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    // Now you can use the speak function whenever you need to speak text
  };
}

function scrollNext() {
  if (currentSection < totalSections) {
    const nextSection = "section" + (currentSection + 1);
    document.getElementById(nextSection).scrollIntoView({ behavior: "smooth" });
    // Add typewriter effect to the next section's text
    const textElement = document.querySelector("#" + nextSection + " .text");
    textElement.classList.add("animated");
    // Speak the text
    speak(textElement.textContent || textElement.innerText);
    currentSection++;
    if (currentSection < totalSections) {
      setTimeout(scrollNext, 5000); // Adjust time as needed
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", function () {
    // Move the speech initiation here
    const initialTextElement = document.querySelector("#section0 .text");
    // initialTextElement.classList.add("animated");
    speak(initialTextElement.textContent || initialTextElement.innerText);
    setTimeout(scrollNext, 5000); // Adjust time as needed
  });
});
