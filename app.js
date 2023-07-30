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