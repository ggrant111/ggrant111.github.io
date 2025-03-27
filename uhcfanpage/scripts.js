const teamAbbr = "UTA"; // Replace 'UTA' with your Utah team's 3-letter abbreviation

// Fetch the team schedule
async function fetchTeamSchedule() {
  try {
    const response = await fetch(
      `https://api-web.nhle.com/v1/club-schedule-season/${teamAbbr}/now`
    );
    const data = await response.json();
    displayTeamSchedule(data.games);
  } catch (error) {
    console.error("Error fetching team schedule:", error);
  }
}

function displayTeamSchedule(games) {
  const scheduleContainer = document.getElementById("schedule-container");
  scheduleContainer.innerHTML = ""; // Clear any existing content

  games.forEach((game) => {
    const gameDate = new Date(game.gameDate).toLocaleDateString();
    const gameInfo = `
            <div class="game">
                <h3>${gameDate}</h3>
                <p>${game.awayTeam.city} (${game.awayTeam.abbrev}) vs ${
      game.homeTeam.city
    } (${game.homeTeam.abbrev})</p>
                <p>Venue: ${game.venue}</p>
                ${
                  game.ticketsLink
                    ? `<a href="${game.ticketsLink}" target="_blank">Buy Tickets</a>`
                    : ""
                }
            </div>
        `;
    scheduleContainer.innerHTML += gameInfo;
  });
}

// Fetch current standings
async function fetchStandings() {
  try {
    const response = await fetch("https://api-web.nhle.com/v1/standings/now");
    const data = await response.json();
    displayStandings(data.standings); // Pass the standings array to display function
  } catch (error) {
    console.error("Error fetching standings:", error);
  }
}

function displayStandings(standings) {
  const standingsContainer = document.getElementById("standings-container");
  standingsContainer.innerHTML = ""; // Clear previous standings

  standings.forEach((team) => {
    // Map the correct fields from the JSON structure
    const teamInfo = `
      <div class="team-standing">
        <h3>${team.teamName.default} (${team.teamAbbrev.default})</h3>
        <img src="${team.teamLogo}" alt="${team.teamName.default} logo" width="50" />
        <p>Conference: ${team.conferenceName}</p>
        <p>Division: ${team.divisionName}</p>
        <p>Games Played: ${team.gamesPlayed}</p>
        <p>Wins: ${team.wins} | Losses: ${team.losses} | OT Losses: ${team.otLosses}</p>
        <p>Points: ${team.points}</p>
        <p>Goal Differential: ${team.goalDifferential}</p>
        <p>Streak: ${team.streakCode} ${team.streakCount}</p>
      </div>
    `;

    standingsContainer.innerHTML += teamInfo;
  });
}

// Call the function to fetch and display the standings
fetchStandings();

// Fetch player stats for the current season
async function fetchPlayerStats() {
  try {
    const response = await fetch(
      `https://api-web.nhle.com/v1/club-stats-season/${teamAbbr}`
    );
    const data = await response.json();
    displayPlayerStats(data.skaters);
    displayGoalieStats(data.goalies);
  } catch (error) {
    console.error("Error fetching player stats:", error);
  }
}

function displayPlayerStats(players) {
  const playerStatsContainer = document.getElementById(
    "player-stats-container"
  );
  playerStatsContainer.innerHTML = ""; // Clear previous stats

  players.forEach((player) => {
    const playerInfo = `
            <div class="player-stat">
                <img src="${player.headshot}" alt="${player.firstName.default} ${player.lastName.default}">
                <h3>${player.firstName.default} ${player.lastName.default}</h3>
                <p>Goals: ${player.goals} | Assists: ${player.assists} | Points: ${player.points}</p>
                <p>Games Played: ${player.gamesPlayed}</p>
            </div>
        `;
    playerStatsContainer.innerHTML += playerInfo;
  });
}

// Display goalie stats
function displayGoalieStats(goalies) {
  const goalieStatsContainer = document.getElementById(
    "goalie-stats-container"
  );
  goalieStatsContainer.innerHTML = ""; // Clear previous goalie stats

  goalies.forEach((goalie) => {
    const goalieInfo = `
            <div class="goalie-stat">
                <img src="${goalie.headshot}" alt="${
      goalie.firstName.default
    } ${goalie.lastName.default}">
                <h3>${goalie.firstName.default} ${goalie.lastName.default}</h3>
                <p>Games Played: ${goalie.gamesPlayed} | Wins: ${
      goalie.wins
    } | Losses: ${goalie.losses}</p>
                <p>Goals Against Average: ${goalie.goalsAgainstAverage.toFixed(
                  2
                )}</p>
                <p>Save Percentage: ${(goalie.savePercentage * 100).toFixed(
                  2
                )}%</p>
            </div>
        `;
    goalieStatsContainer.innerHTML += goalieInfo;
  });
}

// Fetch hero image for the team
async function fetchHeroImage() {
  try {
    const response = await fetch(
      `https://api-web.nhle.com/v1/teams/${teamAbbr}`
    );
    const data = await response.json();
    const heroImage = data.teams[0].officialSiteUrl + "/team/hero-image";
    document.getElementById(
      "hero-image"
    ).style.backgroundImage = `url(${heroImage})`;
  } catch (error) {
    console.error("Error fetching hero image:", error);
  }
}

// Fetch roster data for the team
async function fetchRoster() {
  try {
    const response = await fetch("https://api-web.nhle.com/v1/roster/uta/now");
    const data = await response.json();
    displayRoster(data);
  } catch (error) {
    console.error("Error fetching roster:", error);
  }
}

// Display skaters and goalies on the page as cards
function displayRoster(roster) {
  const playersContainer = document.getElementById("players-container");
  playersContainer.innerHTML = ""; // Clear previous roster

  const allPlayers = [
    ...roster.forwards,
    ...roster.defensemen,
    ...roster.goalies,
  ];

  allPlayers.forEach((player) => {
    const playerCard = `
      <div class="player-card" data-player-id="${
        player.id
      }" onclick="openModal(${player.id})">
        <img src="${player.headshot}" alt="${player.firstName.default} ${
      player.lastName.default
    }" />
        <h3>${player.firstName.default} ${player.lastName.default}</h3>
        <p>Position: ${getPosition(player)}</p>
        <p>Number: ${player.sweaterNumber}</p>
      </div>
    `;
    playersContainer.innerHTML += playerCard;
  });
}

// Get the full position name for players
function getPosition(player) {
  if (player.positionCode === "G") return "Goalie";
  if (player.positionCode === "L") return "Left Wing";
  if (player.positionCode === "C") return "Center";
  if (player.positionCode === "R") return "Right Wing";
  if (player.positionCode === "D") return "Defenseman";
  return "Unknown";
}

// Open modal with player stats when clicking on a player card
function openModal(playerId) {
  const allPlayers = [
    ...roster.forwards,
    ...roster.defensemen,
    ...roster.goalies,
  ];
  const selectedPlayer = allPlayers.find((player) => player.id === playerId);

  if (selectedPlayer) {
    const modalContent = `
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>${selectedPlayer.firstName.default} ${
      selectedPlayer.lastName.default
    }</h2>
        <img src="${selectedPlayer.headshot}" alt="${
      selectedPlayer.firstName.default
    } ${selectedPlayer.lastName.default}" />
        <p>Position: ${getPosition(selectedPlayer)}</p>
        <p>Height: ${selectedPlayer.heightInInches}" (${
      selectedPlayer.heightInCentimeters
    } cm)</p>
        <p>Weight: ${selectedPlayer.weightInPounds} lbs (${
      selectedPlayer.weightInKilograms
    } kg)</p>
        <p>Birthdate: ${selectedPlayer.birthDate}</p>
        <p>Birthplace: ${selectedPlayer.birthCity.default}, ${
      selectedPlayer.birthCountry
    }</p>
        <p>Shoots: ${selectedPlayer.shootsCatches}</p>
      </div>
    `;
    document.getElementById("modal").innerHTML = modalContent;
    document.getElementById("modal").style.display = "block";
  }
}

// Close the modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Fetch the roster on page load
document.addEventListener("DOMContentLoaded", fetchRoster);

// Initialize all data fetching functions when the page loads
function init() {
  fetchRoster();
  fetchTeamSchedule();
  fetchStandings();
  fetchPlayerStats();
  fetchHeroImage();
}

document.addEventListener("DOMContentLoaded", init);
