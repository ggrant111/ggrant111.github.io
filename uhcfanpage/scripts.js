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
    displayStandings(data);
  } catch (error) {
    console.error("Error fetching standings:", error);
  }
}

function displayStandings(standings) {
  const standingsContainer = document.getElementById("standings-container");
  standingsContainer.innerHTML = ""; // Clear previous standings

  standings.forEach((team) => {
    const teamInfo = `
            <div class="team-standing">
                <h3>${team.team.city} (${team.team.abbrev})</h3>
                <p>Wins: ${team.stats.wins} | Losses: ${team.stats.losses} | Points: ${team.stats.points}</p>
            </div>
        `;
    standingsContainer.innerHTML += teamInfo;
  });
}

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

// Initialize all data fetching functions when the page loads
function init() {
  fetchTeamSchedule();
  fetchStandings();
  fetchPlayerStats();
  fetchHeroImage();
}

document.addEventListener("DOMContentLoaded", init);
