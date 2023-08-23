document.addEventListener("DOMContentLoaded", function () {
  const playerCardsContainer = document.getElementById("player-cards-container");
  const modal = document.getElementById("player-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const modalBody = document.getElementById("modal-body");
  const seasonSelect = document.getElementById("season-select");
  const backBtn = document.getElementById("back-btn");
  const teamCardsContainer = document.getElementById("team-cards-container");

  // Fetch the colors data
  fetch('colors.json')
    .then(response => response.json())
    .then(colorsData => {
      // Store colors in an object for easy retrieval
      const teamColors = {};
      colorsData.forEach(colorData => {
        teamColors[colorData.name] = colorData.colors.hex;
      });

      // Fetch NHL teams
      fetch("https://statsapi.web.nhl.com/api/v1/teams")
        .then(response => response.json())
        .then(data => {
          data.teams.forEach((team) => {
            const teamCard = document.createElement("div");
            teamCard.className = "team-card";
            teamCard.setAttribute("data-team-id", team.id);

            // Use team name to get the colors
            const primaryColor = teamColors[team.name] ? `#${teamColors[team.name][0]}` : "#ffffff"; // Default to white if no color
            const secondaryColor = teamColors[team.name] && teamColors[team.name][1] ? `#${teamColors[team.name][1]}` : primaryColor;
            teamCard.style.backgroundColor = primaryColor;
            teamCard.style.borderColor = secondaryColor;
            teamCard.style.color = secondaryColor;


            // Create and append team logo
            const teamLogo = document.createElement("img");
            let teamId = team.id;
            const LogoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;
            teamLogo.src = LogoUrl;
            teamCard.appendChild(teamLogo);

            // Create and append team name
            // const teamName = document.createElement("h3");
            // teamName.textContent = team.name;
            // teamCard.appendChild(teamName);

            // Append the card to a container
            teamCardsContainer.appendChild(teamCard);

            teamCard.addEventListener("click", function () {
              const teamId = this.getAttribute("data-team-id");

              // Fetch roster for selected team
              fetch(`https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`)
                .then((response) => response.json())
                .then((data) => {
                  // Clear previous player cards
                  playerCardsContainer.innerHTML = "";

                  // Generate a card for each player
                  data.roster.forEach((playerDetails) => {
                    const player = playerDetails.person;
                    const teamLogoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;

                    const playerCard = `
                      <div class="card" data-player-id="${player.id}">
                          <img src="http://nhl.bamcontent.com/images/headshots/current/168x168/${player.id}.png" 
                              alt="${player.fullName}" 
                              onerror="this.onerror=null; this.src='assets/images/noheadshot.png';">
                          <div id="playerInfo">
                              <h2>${player.fullName}</h2>
                              <img src="${teamLogoUrl}" alt="Team Logo" width="115">
                              <p>${playerDetails.position.name}</p>
                              <p>#${playerDetails.jerseyNumber}</p>
                          </div>
                      </div>
                    `;

                    // Hide teams and show the back button
                    Array.from(document.querySelectorAll('.team-card')).forEach(el => el.style.display = 'none');
                    backBtn.style.display = 'block';

                    playerCardsContainer.innerHTML += playerCard;
                  });
                });
            });
          });
        });
    });





    backBtn.addEventListener("click", function() {
      // Hide player cards
      playerCardsContainer.innerHTML = "";
      
      // Show teams
      Array.from(document.querySelectorAll('.team-card')).forEach(el => el.style.display = 'block');
      
      // Hide the back button
      backBtn.style.display = 'none';
  });

  playerCardsContainer.addEventListener("click", function (event) {
    if (event.target.closest(".card")) {
      const playerId = event.target
        .closest(".card")
        .getAttribute("data-player-id");
      const playerImage = document.getElementById("player-image");
      const playerName = document.getElementById("modal-player-name");
      const teamLogo = document.getElementById("team-logo");
      const playerNumberAndPosition = document.getElementById(
        "player-number-and-position"
      );

      // Fetch player details
      fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
        .then((response) => response.json())
        .then((data) => {
          const player = data.people[0];
          const teamId = player.currentTeam.id;

          // Set player details in the modal header
          playerImage.src = `http://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.png`;
          playerImage.onerror = function () {
            this.src = "assets/images/noheadshot.png";
          };

          playerName.textContent = player.fullName;
          teamLogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;
          playerNumberAndPosition.textContent = `#${player.primaryNumber} - ${player.primaryPosition.name}`;

          // Get current season
          const currentYear = new Date().getFullYear();
          const lastYear = currentYear - 1;
          const season = `${lastYear}${currentYear}`;

          // Fetch initial season stats for the current season
          fetchStatsForSeason(playerId, season);

          // Populate the season dropdown based on the years the player has played
          populatePlayerSeasonsDropdown(playerId);

          // Show the modal
          modal.style.display = "block";
        });
    }
  });

  function fetchStatsForSeason(playerId, season) {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=${season}`
    )
      .then((response) => response.json())
      .then((data) => {
        const stats = data.stats[0].splits[0].stat;

        // Log the entire stats object to the console
        console.log(stats);

        // Helper function to create a stat string if it's not undefined
        const createStatString = (stat, label) => {
          return stats[stat] !== undefined
            ? `<p>${label}: ${stats[stat]}</p>`
            : "";
        };

        // Construct and display the player stats
        const playerStats = `
                    <h3>Season ${season.substring(0, 4)}-${season.substring(
          4
        )} Stats</h3>
                    ${createStatString("games", "Games Played")}
                    ${createStatString("goals", "Goals")}
                    ${createStatString("assists", "Assists")}
                    ${createStatString("blocked", "Blocked")}
                    ${createStatString("points", "Points")}
                    ${createStatString("pim", "Penalty Minutes")}
                    ${createStatString("evenSaves", "Even Saves")}
                    ${createStatString("evenShots", "Even Shots")}
                    ${createStatString(
                      "evenStrengthSavePercent",
                      "Even Strength Save %"
                    )}
                    ${createStatString("gamesStarted", "Games Started")}
                    ${createStatString(
                      "goalsAgainstAvgerage",
                      "Goals Against Avg"
                    )}
                    ${createStatString("goalsAgainst", "Goals Against")}
                    ${createStatString("losses", "Losses")}
                    ${createStatString("option", "Overtime")}
                    ${createStatString(
                      "powerPlaySavePercent",
                      "Power Play Saves %"
                    )}
                    ${createStatString("powerPlaySaves", "Power Play Saves")}
                    ${createStatString("powerPlayShots", "Power Play Shots")}
                    ${createStatString("savePercentage", "Save %")}
                    ${createStatString("saves", "Saves")}
                    ${createStatString(
                      "shortHandedSavePercent",
                      "Short Handed Save %"
                    )}
                    ${createStatString(
                      "shortHandedSaves",
                      "Short Handed Saves"
                    )}
                    ${createStatString(
                      "shortHandedShots",
                      "Short Handed Shots"
                    )}
                    ${createStatString("shotsAgainst", "Shots Against")}
                    ${createStatString("shutouts", "Shutouts")}
                    ${createStatString("ties", "Ties")}
                    ${createStatString("evenTimeOnIce", "Even Time on Ice")}
                    ${createStatString(
                      "evenTimeOnIcePerGame",
                      "Even Time on Ice/Game %"
                    )}
                    ${createStatString("timeOnIce", "Time on Ice")}
                    ${createStatString("timeOnIcePerGame", "Time on Ice/Game")}
                    ${createStatString("wins", "Wins")}
                `;

        modalBody.innerHTML = playerStats;
      });
  }

  function populatePlayerSeasonsDropdown(playerId) {
    // Fetch available seasons for the player
    fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=yearByYear`
    )
      .then((response) => response.json())
      .then((data) => {
        const availableSeasons = data.stats[0].splits.map(
          (split) => split.season
        );

        // Sort the seasons in descending order
        availableSeasons.sort((a, b) => b - a);

        seasonSelect.innerHTML = ""; // Clear existing options

        availableSeasons.forEach((season) => {
          const option = document.createElement("option");
          option.value = season;
          option.textContent = `${season.substring(0, 4)}-${season.substring(
            4
          )}`;
          seasonSelect.appendChild(option);
        });
      });
  }

  // Event listener for the season dropdown change
  seasonSelect.addEventListener("change", function () {
    const playerId = playerCardsContainer
      .querySelector(".card[data-player-id]")
      .getAttribute("data-player-id");
    fetchStatsForSeason(playerId, this.value);
  });

  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
