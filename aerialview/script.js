const addressInput = document.getElementById("address");
const videoContainer = document.getElementById("videoContainer");
const addressHistorySelect = document.getElementById("addressHistory");
const apiKey = "AIzaSyCH9HT3RMz3G2rJa6Wr49paY_3GY4iPe7Q";


function checkAndDisplayVideo() {
    const address = addressInput.value;
    const name = document.getElementById("addressName").value;

    if (name && name.trim() !== '') {
        saveAddress(name, address);
        updateAddressHistory();
    }

    generateNewVideo(address, apiKey);
}





function saveAddress(name, address) {
    let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || {};
    if (savedAddresses[name]) {
        alert("This name already exists. Please choose a different name.");
        return;
    }
    savedAddresses[name] = address;
    localStorage.setItem("addresses", JSON.stringify(savedAddresses));
}




function updateAddressHistory() {
    const addressHistorySelect = document.getElementById("addressHistory");
    let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || {};

    // Clear existing options
    addressHistorySelect.innerHTML = '';

    // Append new options from saved addresses
    for (const name in savedAddresses) {
        if (savedAddresses.hasOwnProperty(name)) {
            const option = document.createElement("option");
            option.value = savedAddresses[name];
            option.text = name;
            addressHistorySelect.appendChild(option);
        }
    }
}


function selectAddress() {
    const addressHistorySelect = document.getElementById("addressHistory");
    const addressInput = document.getElementById("address");
    addressInput.value = addressHistorySelect.value;
}


function generateNewVideo(address, apiKey) {
    // First, check if the video already exists
    fetch(`https://aerialview.googleapis.com/v1/videos:lookupVideoMetadata?key=${apiKey}&address=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            // Corrected the condition to match the response structure
            if (data && data.videoId) {
                if (data.state === "ACTIVE") {
                    displayVideo(data.videoId, apiKey, address);
                } else if (data.state === "PROCESSING") {
                    updateMessage("Video is being processed. Please check back later.");
                }
            } else {
                // If videoId is not present or state is not ACTIVE or PROCESSING
                renderVideo(address, apiKey);
            }
        })
        .catch(error => {
            console.error("Error checking video metadata:", error);
            renderVideo(address, apiKey); // Fallback to rendering video in case of an error
        });
}


function renderVideo(address, apiKey) {
    fetch(`https://aerialview.googleapis.com/v1/videos:renderVideo?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.metadata && data.metadata.videoId) {
            if (data.state === "ACTIVE") {
                displayVideo(data.metadata.videoId, apiKey, address);
            } else if (data.state === "PROCESSING") {
                updateMessage("Video is being processed. Please check back later.");
            }
        } else if (data.error && data.error.message) {
            updateMessage("Error: " + data.error.message);
        } else {
            updateMessage("Request to generate a new video has been sent. Please check back later.");
        }
    })
    .catch(error => {
        console.error("Error rendering video:", error);
        updateMessage("Error generating video. Please try again.");
    });
}


function displayVideo(videoId, apiKey, address) {
    fetch(`https://aerialview.googleapis.com/v1/videos:lookupVideo?key=${apiKey}&videoId=${videoId}`)
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById("videoContainer");
            if (data.state === "ACTIVE" && data.uris && data.uris.MP4_HIGH) {
                const videoUri = data.uris.MP4_HIGH.landscapeUri; // or portraitUri
                videoContainer.innerHTML = `
                    <video id="aerialVideo" src="${videoUri}" controls autoplay> </video>
                    <p id="videoDescription">This is a photorealistic aerial view of ${address} provided by Google Maps.</p>
                `;

                // Set the playback rate
                const videoElement = document.getElementById("aerialVideo");
                videoElement.playbackRate = 2.0;
            } else {
                updateMessage("Video is not active or URI not found.");
            }
        })
        .catch(error => {
            console.error("Error displaying video:", error);
            updateMessage("Error displaying video. Please try again.");
        });
}

function updateMessage(message) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = `<p>${message}</p>`;
}

// function initAutocomplete() {
//     const autocomplete = new google.maps.places.Autocomplete(
//         document.getElementById('address'), {types: ['geocode']}
//     );

//     autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
//         let streetAddress = '', city = '', state = '', postalCode = '';

//         // Loop through the address components
//         for (const component of place.address_components) {
//             const componentType = component.types[0];
//             if (componentType === 'street_number' && streetAddress) {
//                 streetAddress = component.long_name + ' ' + streetAddress;
//             } else if (componentType === 'route') {
//                 streetAddress += component.long_name;
//             }

//             switch (componentType) {
//                 case 'street_number': // part of the street address
//                     streetAddress = component.long_name + ' ' + streetAddress;
//                     break;
//                 case 'route': // part of the street address
//                     streetAddress += component.long_name;
//                     break;
//                 case 'locality': // city
//                     city = component.long_name;
//                     break;
//                 case 'administrative_area_level_1': // state
//                     state = component.short_name;
//                     break;
//                 case 'postal_code': // zip code
//                     postalCode = component.long_name;
//                     break;
//             }
//         }

//         // Format the address
//         const formattedAddress = `${streetAddress}, ${city}, ${state} ${postalCode}`;

//         // Update the address input with the formatted address
//         document.getElementById('address').value = formattedAddress;
//     });
// }


// Call the initialization function when the script is loaded
function initScript() {
    initAutocomplete();
}


document.addEventListener('DOMContentLoaded', () => {
    initAutocomplete();
});


document.addEventListener("DOMContentLoaded", updateAddressHistory);
