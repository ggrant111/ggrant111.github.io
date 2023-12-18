newElement.onclick = function() { 
    var deviceAddress = this.textContent.split(' (')[1].slice(0, -1);
    document.getElementById('deviceAddress').value = deviceAddress;
    fetchDataAndUpdateUI(deviceAddress);
};
document.getElementById('cyclePresets').addEventListener('click', function() {
    sendRequest({ "ps": "1~6~" });
});

document.getElementById('randomEffect').addEventListener('click', function() {
    sendRequest({ "seg": { "fx": "r" } });
});

document.getElementById('nextEffect').addEventListener('click', function() {
    sendRequest({ "seg": { "fx": "~" } });
});

document.getElementById('previousEffect').addEventListener('click', function() {
    sendRequest({ "seg": { "fx": "~-" } });
});

document.getElementById('randomPalette').addEventListener('click', function() {
    sendRequest({ "seg": [{"id": 0, "pal": "1~40~r"}] });
});

document.getElementById('changeSegmentName').addEventListener('click', function() {
    sendRequest({ "seg": [{"id": 0, "n": "Your custom ASCII text"}] });
});

document.getElementById('freezeEffect').addEventListener('click', function() {
    sendRequest({ "seg": [{"id": 0, "frz": true}] });
});

document.getElementById('unfreezeEffect').addEventListener('click', function() {
    sendRequest({ "seg": [{"id": 0, "frz": false}] });
});

document.getElementById('nightLight').addEventListener('click', function() {
    sendRequest({ "nl": {"on": true, "dur": 10, "mode": 0} });
});

document.getElementById('increaseBrightness').addEventListener('click', function() {
    sendRequest({ "bri": "w~40" });
});


document.getElementById('powerSwitch').addEventListener('change', function() {
    var isOn = this.checked; // This will be true if the switch is turned on
    sendRequest({ on: isOn }, function() {
        checkState();
    });
});


document.getElementById('brightness').addEventListener('input', function() {
    sendRequest({ bri: parseInt(this.value) }); // Adjust brightness
});

// document.getElementById('presets').addEventListener('change', function() {
//     sendRequest({ ps: parseInt(this.value) }); // Change preset
// });

function getCurrentStateAndToggle() {
    var deviceAddress = document.getElementById('deviceAddress').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + deviceAddress + '/json/state', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var currentState = JSON.parse(xhr.responseText);
            sendRequest({ on: !currentState.on }); // Toggle based on current state
        }
    };
    xhr.send();
    
}

function sendRequest(data, callback) {
    var xhr = new XMLHttpRequest();
    var deviceAddress = document.getElementById('deviceAddress').value;
    xhr.open('POST', 'http://' + deviceAddress + '/json/state', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Add a delay before calling the callback
            setTimeout(function() {
                if (callback) callback();
            }, 500); // Adjust the delay time as needed
        }
    };
    xhr.send(JSON.stringify(data));
}




function checkState() {
    var deviceAddress = document.getElementById('deviceAddress').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + deviceAddress + '/json/state', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            displayState(response);
        }
    };
    xhr.send();
}

function displayState(state) {
    var stateInfo = "Power: " + (state.on ? "On" : "Off") + "<br>";
    stateInfo += "Brightness: " + state.bri + "<br>";
    stateInfo += "Effect: " + state.seg[0].fx + "<br>";
    // Add more details as needed
    document.getElementById('stateDisplay').innerHTML = stateInfo;
    console.log(stateInfo);
}

// function displayState(state) {
//     var stateInfo = "<h5>Device State:</h5>";
//     stateInfo += "<ul>";

//     for (var key in state) {
//         if (state.hasOwnProperty(key)) {
//             stateInfo += "<li>" + key + ": " + JSON.stringify(state[key]) + "</li>";
//         }
//     }

//     stateInfo += "</ul>";
//     document.getElementById('stateDisplay').innerHTML = stateInfo;
// }


function fetchDeviceInfo() {
    var deviceAddress = document.getElementById('deviceAddress').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + deviceAddress + '/json/info', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var info = JSON.parse(xhr.responseText);
            displayDeviceInfo(info);
        }
    };
    xhr.send();
}

function displayDeviceInfo(info) {
    var infoDisplay = "Version: " + info.ver + "<br>" +
                      "LED Count: " + info.leds.count + ", Power: " + info.leds.pwr + "mA, FPS: " + info.leds.fps + "<br>" +
                      "Max Power: " + info.leds.maxpwr + "mA, Max Segments: " + info.leds.maxseg + "<br>" +
                      "Device Name: " + info.name + "<br>" +
                      "UDP Port: " + info.udpport + "<br>" +
                      "WiFi BSSID: " + info.wifi.bssid + ", Signal: " + info.wifi.signal + ", Channel: " + info.wifi.channel + "<br>" +
                      "File System Usage: " + info.fs.u + "KB / " + info.fs.t + "KB<br>" +
                      "Architecture: " + info.arch + ", Core Version: " + info.core + "<br>" +
                      "Free Heap: " + info.freeheap + " bytes, Uptime: " + info.uptime + " seconds<br>" +
                      "IP Address: " + info.ip + "<br>";
    // Add more details as needed
    document.getElementById('deviceInfoDisplay').innerHTML = infoDisplay;
}

// function fetchEffects() {
//     var deviceAddress = document.getElementById('deviceAddress').value;
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://' + deviceAddress + '/json/effects', true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             var effects = JSON.parse(xhr.responseText);
//             populateEffects(effects);
//         }
//     };
//     xhr.send();
// }

function fetchAndDisplayEffects() {
    var deviceAddress = document.getElementById('deviceAddress').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + deviceAddress + '/json/effects', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var effects = JSON.parse(xhr.responseText);
            populateEffectsPills(effects); // Assuming the response has an array of effects
        }
    };
    xhr.send();
}

function fetchDataAndUpdateUI(deviceAddress) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + deviceAddress + '/json/', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            updateUI(response);
        }
    };
    xhr.send();
}

function updateUI(data) {
    // Update power switch
    document.getElementById('powerSwitch').checked = data.state.on;

    // Update brightness
    document.getElementById('brightness').value = data.state.bri;

    // Update effects pills
    populateEffectsPills(data.effects);

    // Additional updates can be done here based on the data
}

function populateEffectsPills(effects) {
    var effectsPills = document.getElementById('effectsPills');
    effectsPills.innerHTML = '';

    effects.forEach(function(effect, index) {
        var pill = document.createElement('button');
        pill.classList.add('effect-pill', 'btn');
        pill.innerHTML = effect;
        pill.onclick = function() { /* Logic for selecting an effect */ };
        effectsPills.appendChild(pill);
    });
}

// Example usage
// fetchDataAndUpdateUI('10.0.0.205'); // Replace with the actual address


function setActivePill(selectedPill) {
    var pills = document.querySelectorAll('.effect-pill');
    pills.forEach(pill => pill.classList.remove('active'));
    selectedPill.classList.add('active');
}


function populateEffects(effects) {
    var select = document.getElementById('effectsDropdown');
    select.innerHTML = ''; // Clear existing options
    effects.forEach(function(effect, index) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = effect;
        select.appendChild(opt);
    });
}

document.getElementById('saveDevice').addEventListener('click', function() {
    var deviceAddress = document.getElementById('deviceAddress').value;
    var deviceName = document.getElementById('deviceName').value;
    if(deviceAddress && deviceName) {
        localStorage.setItem(deviceName, deviceAddress);
        updateSavedDevicesDropdown();
        alert('Device saved!');
    } else {
        alert('Please enter both name and IP address');
    }
});

function updateSavedDevicesDropdown() {
    console.log('Updating saved devices dropdown'); // This line for debugging
    var savedDevicesMenu = document.getElementById('savedDevicesMenu');
    savedDevicesMenu.innerHTML = ''; // Clear existing list
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var newElement = document.createElement('a');
        newElement.classList.add('dropdown-item');
        newElement.href = '#';
        newElement.textContent = key + ' (' + value + ')';
        newElement.onclick = function() { 
            document.getElementById('deviceAddress').value = this.textContent.split(' (')[1].slice(0, -1); 
        };
        savedDevicesMenu.appendChild(newElement);
        console.log(newElement);
    }
}


// Call this function on page load to populate the dropdown
window.onload = function() {
    updateSavedDevicesDropdown();
    // Any other functions you want to run on page load
};

// Optional: Populate presets dropdown
// You might need to fetch the presets from the WLED device or define them manually.
