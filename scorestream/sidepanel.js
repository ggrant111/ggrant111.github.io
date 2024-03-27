let currentGameId = null;
let game = null;

document.addEventListener("DOMContentLoaded", (event) => {
  applyDarkMode();

  const refreshButton = document.querySelector(".refresh-btn");
  if (refreshButton) {
    refreshButton.addEventListener("click", () =>
      fetchScores(getSelectedgender())
    );
  }

  initiateCountdown();
  var span = document.getElementsByClassName("close")[0]; // Assuming there's only one close button
  if (span) {
    span.onclick = function () {
      var modal = document.getElementById("gameDetailsModal");
      if (modal) modal.style.display = "none";
    };
  }
});

async function fetchScores(gender) {
  const baseApiUrl = "https://site.api.espn.com/apis/site/v2/sports/";
  let urls = [];
  let combinedEvents = [];

  // Set up URLs based on the gender selection
  switch (gender) {
    case "mens-college-basketball":
      urls.push(`${baseApiUrl}basketball/mens-college-basketball/scoreboard`);
      break;
    case "womens-college-basketball":
      urls.push(`${baseApiUrl}basketball/womens-college-basketball/scoreboard`);
      break;
    case "nfl":
      urls.push(`${baseApiUrl}football/nfl/scoreboard`);
      break;
    case "nhl":
      urls.push(`${baseApiUrl}hockey/nhl/scoreboard`);
      break;
    case "mlb":
      urls.push(`${baseApiUrl}baseball/mlb/scoreboard`);
      break;
    case "ncaaf":
      urls.push(`${baseApiUrl}football/college-football/scoreboard`);
      break;
    case "nba":
      urls.push(`${baseApiUrl}basketball/nba/scoreboard`);
      break;
    case "wnba":
      urls.push(`${baseApiUrl}basketball/wnba/scoreboard`);
      break;
    case "mls":
      urls.push(`${baseApiUrl}soccer/usa.1/scoreboard`);
      break;
    case "both":
      urls.push(
        `${baseApiUrl}basketball/mens-college-basketball/scoreboard`,
        `${baseApiUrl}womens-college-basketball/scoreboard`
      );
      break;
    default:
      console.error("Unexpected gender value:", gender);
      return;
  }

  document.getElementById("scores").innerHTML = "<p>Refreshing scores...</p>";

  try {
    // Fetch scores for all selected categories
    const responses = await Promise.all(urls.map((url) => fetch(url)));
    for (const response of responses) {
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      combinedEvents = combinedEvents.concat(data.events); // Combine events from both genders
    }

    // Sort combined events before processing
    combinedEvents.sort((a, b) => {
      const statusA = a.competitions[0].status.type.state;
      const statusB = b.competitions[0].status.type.state;
      const startTimeA = new Date(a.date).getTime();
      const startTimeB = new Date(b.date).getTime();

      if (statusA === "in" && statusB !== "in") return -1;
      if (statusA !== "in" && statusB === "in") return 1;
      if (statusA === "pre" && statusB !== "pre") return -1;
      if (statusA !== "pre" && statusB === "pre") return 1;

      return startTimeA - startTimeB; // Earlier games first
    });

    // Process the sorted, combined events
    const scoresHtml = processScoresData({ events: combinedEvents });
    document.getElementById("scores").innerHTML = scoresHtml;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    document.getElementById("scores").innerHTML =
      "<p>Failed to load scores.</p>";
  }

  // Usage example: Attach this function to the click event of the game-div elements
  document.querySelectorAll(".game-div").forEach((div) => {
    div.addEventListener("click", function () {
      const gameId = this.dataset.gameId;

      console.log("clicked", { gameId: gameId });
      currentGameId = gameId;
      console.log("currentGameId", currentGameId); // Log the gameId associated with the clicked element
      // displayGameDetails(gameId);
      // showGameDetails(game);
    });
  });
}

function processScoresData(data) {
  // Get the selected score difference from the number input
  const selectedScoreDiff = parseInt(
    document.getElementById("scoreDifferenceInput").value,
    10
  );

  if (data.events && data.events.length > 0) {
    // First, sort the games: live games first, then upcoming, and finalized games last
    const sortedEvents = data.events.sort((a, b) => {
      const statusA = a.competitions[0].status.type.state;
      const statusB = b.competitions[0].status.type.state;
      const startTimeA = new Date(a.date).getTime();
      const startTimeB = new Date(b.date).getTime();

      if (statusA === "in" && statusB !== "in") return -1;
      if (statusA !== "in" && statusB === "in") return 1;
      if (statusA === "pre" && statusB !== "pre") return -1;
      if (statusA !== "pre" && statusB === "pre") return 1;

      return startTimeA - startTimeB; // Earlier games first
    });

    // Then, process and return HTML string for each sorted event
    return sortedEvents
      .map((event) => {
        const game = event.competitions[0];
        const homeTeam = game.competitors.find(
          (team) => team.homeAway === "home"
        );
        const awayTeam = game.competitors.find(
          (team) => team.homeAway === "away"
        );
        const status = game.status.type.detail;
        const network = game.broadcasts
          ? game.broadcasts
              .map((broadcast) => broadcast.names.join(", "))
              .join(", ")
          : "Not available";
        const stadium = game.venue.fullName || "Not available";
        const city = game.venue.address.city || "Not available";
        const state = game.venue.address.state || "";
        const scoreDiff = Math.abs(
          parseInt(homeTeam.score, 10) - parseInt(awayTeam.score, 10)
        );

        // Now, correctly use the dynamically selected score difference for determining "close games"
        const isCloseGame =
          homeTeam.score > 0 &&
          awayTeam.score > 0 &&
          scoreDiff <= selectedScoreDiff
            ? "close-game"
            : "";
        const liveIndicator =
          game.status.type.state === "in"
            ? `<span class="text-red-500"><span class="live-indicator-dot"></span>Live</span>`
            : "";

        return `<div class="game-div p-4 border border-gray-200 rounded-lg ${isCloseGame}" data-game-id="${event.id}">
            <div class="flex justify-between items-center">
                <div>
                    
                    <h3><img src="${awayTeam.team.logo}" alt="${awayTeam.team.abbreviation} Logo" style="width:20px;"> ${awayTeam.team.abbreviation} - ${awayTeam.score}</h3>
                    <h3><img src="${homeTeam.team.logo}" alt="${homeTeam.team.abbreviation} Logo" style="width:20px;"> ${homeTeam.team.abbreviation} - ${homeTeam.score}</h3>
                    <p>${status}</p>
                    <p>${network} - ${stadium} - ${city}, ${state}</p>
                </div>
                <div>${liveIndicator}</div>
            </div>
        </div>`;
      })
      .join("");
  } else {
    return "<p>No games currently.</p>";
  }
}

function initiateCountdown() {
  clearInterval(window.countdownInterval); // Clear any existing interval to avoid multiple intervals running

  let countdown = 30; // Set countdown duration (in seconds)

  // Function to update countdown display and manage countdown logic
  const countdownFunction = () => {
    if (countdown > 0) {
      // If countdown is not yet 0, decrement and update display
      countdown -= 1;
      updateCountdown(countdown);
    } else {
      // When countdown reaches 0, fetch scores and reset countdown
      clearInterval(window.countdownInterval); // Clear interval to stop the countdown
      fetchScores(getSelectedgender()); // Fetch new scores based on the current gender selection
      applyDarkMode();
      // Instead of setting countdown to 30 again here, we restart the initiateCountdown function to reset everything
      initiateCountdown(); // This ensures the countdown restarts properly after each cycle
    }
  };

  // Update countdown display immediately before starting the interval
  updateCountdown(countdown);

  // Start the countdown interval
  window.countdownInterval = setInterval(countdownFunction, 1000); // Update every second
}

function updateCountdown(seconds) {
  const countdownElement = document.getElementById("countdown");
  if (countdownElement) {
    countdownElement.textContent = `Refreshing in ${seconds}s`;
  }
}

// Function to get the currently selected gender value
function getSelectedgender() {
  return document.querySelector('input[name="gender"]:checked').value;
}

// Listen for changes on each radio button
document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("click", function () {
    fetchScores(getSelectedgender());
  });
});

function applyDarkMode() {
  const darkModeOn = document.getElementById("darkModeToggle").checked;
  document.querySelectorAll("div").forEach((div) => {
    div.classList.toggle("dark-mode", darkModeOn);
  });
}
document.addEventListener("click", function (event) {
  let target = event.target;

  // Traverse up the DOM to find the enclosing 'game-div' element
  while (target != null && !target.classList.contains("game-div")) {
    target = target.parentNode;
  }

  // If a 'game-div' was clicked
  if (target && target.classList.contains("game-div")) {
    // Extract the 'data-game-id' attribute
    const gameId = target.getAttribute("data-game-id");

    // Get the selected gender value from the radio buttons
    const gender = document.querySelector(
      'input[name="gender"]:checked'
    )?.value;

    // Base API URL
    const baseApiUrl = "https://site.api.espn.com/apis/site/v2/sports/";

    // Determine the URL path based on the gender/sport
    let urlPath;
    switch (gender) {
      case "mens-college-basketball":
        urlPath = `basketball/mens-college-basketball/summary?event=${gameId}`;
        break;
      case "womens-college-basketball":
        urlPath = `basketball/womens-college-basketball/summary?event=${gameId}`;
        break;
      case "nfl":
        urlPath = `football/nfl/summary?event=${gameId}`;
        break;
      case "nhl":
        urlPath = `hockey/nhl/summary?event=${gameId}`;
        break;
      case "nba":
        urlPath = `basketball/nba/summary?event=${gameId}`;
        break;
      case "wnba":
        urlPath = `basketball/wnba/summary?event=${gameId}`;
        break;
      case "ncaaf":
        urlPath = `football/college-football/summary?event=${gameId}`;
        break;
      case "mls":
        urlPath = `soccer/usa.1/summary?event=${gameId}`;
        break;
      case "mlb":
        urlPath = `baseball/mlb/summary?event=${gameId}`;
        break;
      // Add other cases as necessary...
      default:
        console.error("Unexpected gender/sport value:", gender);
        return;
    }

    // Construct the URL for the API call
    const url = baseApiUrl + urlPath;

    // Make the API call
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Assuming 'showModal' is a function that displays the modal with the game details
        showModal(data);
      })
      .catch((error) => console.error("Error fetching game details:", error));
  }
});

function showModal(gameDetails) {
  const modalBody = document.getElementById("modal-body");
  if (!modalBody) {
    console.error("Modal body element not found.");
    return;
  }
  modalBody.innerHTML = "";

  if (
    !gameDetails ||
    !gameDetails.boxscore ||
    !gameDetails.boxscore.teams ||
    gameDetails.boxscore.teams.length < 2
  ) {
    console.error("Invalid game details structure or not enough teams.");
    return;
  }

  // Setup layout container for teams and stats
  const layoutContainer = document.createElement("div");
  layoutContainer.style.display = "flex";
  layoutContainer.style.justifyContent = "space-between";
  layoutContainer.style.width = "100%";

  const awayTeamContainer = document.createElement("div");
  const statsLabelContainer = document.createElement("div");
  const homeTeamContainer = document.createElement("div");

  [awayTeamContainer, statsLabelContainer, homeTeamContainer].forEach(
    (container) => {
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";
      container.style.flex = "1";
      container.style.justifyContent = "flex-end";
      container.style.fontWeight = "bold";
    }
  );

  // Append team logos and names
  [gameDetails.boxscore.teams[0], gameDetails.boxscore.teams[1]].forEach(
    (team, index) => {
      const container = index === 0 ? awayTeamContainer : homeTeamContainer;
      const logo = document.createElement("img");
      logo.src = team.team.logo;
      logo.alt = `${team.team.displayName} Logo`;
      logo.style.height = "75px";
      container.appendChild(logo);

      const name = document.createElement("div");
      name.textContent = team.team.displayName;
      name.style.fontWeight = "bold";
      container.appendChild(name);
    }
  );

  // Placeholder corrected
  const placeholder = document.createElement("div");
  placeholder.style.height = "75px"; // Adjust based on actual logo and name height
  statsLabelContainer.appendChild(placeholder);

 // Handle and display stats
 const firstTeamStats = gameDetails.boxscore.teams[0].statistics;
 firstTeamStats.forEach((statCategory, index) => {
     const isNested = statCategory.hasOwnProperty('stats');

     const statsToProcess = isNested ? statCategory.stats : [statCategory];
     statsToProcess.forEach(stat => {
         const awayStatValue = stat.displayValue;
         const homeStatValue = isNested ?
             gameDetails.boxscore.teams[1].statistics.find(cat => cat.name === statCategory.name).stats.find(homeStat => homeStat.name === stat.name)?.displayValue :
             gameDetails.boxscore.teams[1].statistics[index]?.displayValue || 'N/A';

         // Away team value
         const awayValue = document.createElement('div');
         awayValue.textContent = awayStatValue;
         awayTeamContainer.appendChild(awayValue);

         // Label with tooltip
         const label = document.createElement('div');
         label.textContent = stat.abbreviation || stat.label || stat.name;
         label.className = 'tooltip'; // Add tooltip class

         // Create the tooltip text element
         const tooltipText = document.createElement('span');
         tooltipText.className = 'tooltiptext';
         tooltipText.textContent = stat.label || stat.name; // The text you want to show in the tooltip
         label.appendChild(tooltipText); // Append the tooltip text to the label

         statsLabelContainer.appendChild(label); // Append the label to the statsLabelContainer here

         // Home team value
         const homeValue = document.createElement('div');
         homeValue.textContent = homeStatValue;
         homeTeamContainer.appendChild(homeValue);
     });
 });

 // Assemble the layout...
 layoutContainer.appendChild(awayTeamContainer);
 layoutContainer.appendChild(statsLabelContainer);
 layoutContainer.appendChild(homeTeamContainer);
 modalBody.appendChild(layoutContainer);

 document.getElementById('gameDetailsModal').style.display = 'block';
 document.getElementById('closeButton').onclick = () => document.getElementById('gameDetailsModal').style.display = 'none';
}

// Function to close the modal
function closeModal() {
  document.getElementById("gameDetailsModal").style.display = "none";
}

document
  .getElementById("scoreDifferenceInput")
  .addEventListener("input", function () {
    fetchScores(getSelectedgender()); // Re-fetch or refresh the display using the new score difference
  });

document
  .getElementById("darkModeToggle")
  .addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });

document
  .getElementById("darkModeToggle")
  .addEventListener("change", function () {
    const isChecked = this.checked;
    document.querySelectorAll("div").forEach(function (div) {
      div.classList.toggle("dark-mode", isChecked);
    });
  });

// Add event listener to the close button
document.getElementById("closeButton").addEventListener("click", closeModal);
// Initial fetch for the default selection (men's scores in this example)

fetchScores(getSelectedgender());
