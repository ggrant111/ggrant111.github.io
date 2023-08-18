// Define DOM elements
const fetchButton = document.getElementById("fetchTemplate");
const madlibOutput = document.getElementById("madlibOutput");
const speakButton = document.getElementById("speak");
const shareButton = document.getElementById("share");
const viewHistoryButton = document.getElementById("viewHistory");
const inputModal = document.getElementById("inputModal");
const historyModal = document.getElementById("historyModal");

let voicesLoaded = false;
let availableVoices = [];

window.speechSynthesis.onvoiceschanged = function() {
    availableVoices = window.speechSynthesis.getVoices();
    voicesLoaded = true;
};

// Fetch random template from "templates.json"
async function fetchRandomTemplate() {
    try {
        const response = await fetch("templates.json");
        const templates = await response.json();
        const randomIndex = Math.floor(Math.random() * templates.length);
        return templates[randomIndex];
    } catch (error) {
        console.error("Failed to fetch template:", error);
    }
}

// Generate madlib using the fetched template
async function promptForMadlib() {
    const selectedTemplate = await fetchRandomTemplate();

    if (selectedTemplate && selectedTemplate.content) {
        const placeholders = selectedTemplate.content
            .match(/{{[^}]+}}/g)
            .map((match) => match.replace(/{{|}}/g, "").trim());
        openInputModal(placeholders, selectedTemplate.content);
    }
}

function openInputModal(placeholders, template) {
    const modalContent = document.querySelector("#inputModal .modal-content");
    modalContent.innerHTML = ""; // Clear previous content

    placeholders.forEach((placeholder) => {
        const div = document.createElement("div");
        div.className = "input-group";

        const label = document.createElement("label");
        label.innerText = placeholder;

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = placeholder.replace(/{{|}}/g, "");

        div.appendChild(label);
        div.appendChild(input);

        modalContent.appendChild(div);
    });

    const submitButton = document.createElement("button");
    submitButton.innerHTML = '<i class="fas fa-magic"></i>'; // Corrected line
    submitButton.addEventListener("click", function () {
        const inputs = modalContent.querySelectorAll("input");
        const userInputs = Array.from(inputs).map((input) => input.value);
        generateMadlib(template, placeholders, userInputs);
        inputModal.style.display = "none";
    });
    

    modalContent.appendChild(submitButton);
    inputModal.style.display = "block";
}

function generateMadlib(template, placeholders, userInputs) {
    let madlibText = template;
    placeholders.forEach((placeholder, index) => {
        const regex = new RegExp(`{{\\s*${placeholder}\\s*}}`, "g");
        madlibText = madlibText.replace(regex, userInputs[index]);
    });

    madlibOutput.innerText = madlibText;
    saveToLocalStorage(madlibText);
}

function saveToLocalStorage(madlibText) {
    let madlibs = JSON.parse(localStorage.getItem("madlibs") || "[]");
    madlibs.unshift(madlibText);
    if (madlibs.length > 10) madlibs.pop(); // Limit to 10 recent madlibs
    localStorage.setItem("madlibs", JSON.stringify(madlibs));
}

function viewHistory() {
    const madlibs = JSON.parse(localStorage.getItem("madlibs") || "[]");
    const modalContent = document.querySelector("#historyModal .modal-content");
    modalContent.innerHTML = madlibs.join("<hr>");
    historyModal.style.display = "block";
}

// Splitting the text into smaller chunks
function splitTextIntoChunks(text, chunkSize) {
    const chunks = [];
    while (text.length > chunkSize) {
        let index = text.lastIndexOf(' ', chunkSize); // Find the last space within the chunk size
        let chunk = text.substring(0, index);
        chunks.push(chunk);
        text = text.substring(index + 1);
    }
    chunks.push(text); // Push the last chunk
    return chunks;
}

// Speaking the chunks sequentially
function speakChunksSequentially(chunks) {
    return new Promise((resolve) => {
        let index = 0;

        function speakNextChunk() {
            if (index >= chunks.length) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(chunks[index]);
            const selectedVoice = availableVoices.find(voice => voice.name === 'Google UK English Female');
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.onend = () => {
                index++;
                speakNextChunk();
            };

            window.speechSynthesis.speak(utterance);
        }

        speakNextChunk();
    });
}

function speakMadlib() {
    const text = document.getElementById('madlibOutput').textContent;
    const chunks = splitTextIntoChunks(text, 200); // Split into chunks of approximately 200 characters

    if (voicesLoaded) {
        speakChunksSequentially(chunks);
    } else {
        // Retry after a short delay if voices are not loaded yet
        setTimeout(() => speakMadlib(), 100);
    }
}

function shareMadlib() {
    if (navigator.share) {
        navigator.share({
            title: "My Madlib",
            text: madlibOutput.innerText,
            url: document.location.href,
        });
    } else {
        alert("Sharing is not supported on this device.");
    }
}

// Event listeners
fetchButton.addEventListener("click", promptForMadlib);
speakButton.addEventListener("click", speakMadlib);
shareButton.addEventListener("click", shareMadlib);
viewHistoryButton.addEventListener("click", viewHistory);

// Close modals when clicked outside
window.onclick = function (event) {
    if (event.target == inputModal) {
        inputModal.style.display = "none";
    }
    if (event.target == historyModal) {
        historyModal.style.display = "none";
    }
};
