document.addEventListener("DOMContentLoaded", function () {
  const playerCardsContainer = document.getElementById(
    "player-cards-container"
  );
  const modal = document.getElementById("player-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const modalBody = document.getElementById("modal-body");
  const seasonSelect = document.getElementById("playerSeasonSelect");
  const backBtn = document.getElementById("back-btn");
  const teamCardsContainer = document.getElementById("team-cards-container");
  let selectedPlayerId = null;
  let selectedTeamPrimaryColor = "";
  let selectedTeamSecondaryColor = "";

  // Fetch the colors data
  fetch("colors.json")
    .then((response) => response.json())
    .then((colorsData) => {
      // Store colors in an object for easy retrieval
      const teamColors = {};
      colorsData.forEach((colorData) => {
        teamColors[colorData.name] = colorData.colors.hex;
      });

      // Fetch NHL teams
      fetch("https://statsapi.web.nhl.com/api/v1/teams")
        .then((response) => response.json())
        .then((data) => {
          data.teams.forEach((team) => {
            const teamCard = document.createElement("div");
            teamCard.className = "team-card";
            teamCard.setAttribute("data-team-id", team.id);

            // Use team name to get the colors
            const primaryColor = teamColors[team.name]
              ? `#${teamColors[team.name][0]}`
              : "#ffffff"; // Default to white if no color
            const secondaryColor =
              teamColors[team.name] && teamColors[team.name][1]
                ? `#${teamColors[team.name][1]}`
                : primaryColor;
            teamCard.style.backgroundColor = primaryColor;
            teamCard.style.borderColor = secondaryColor;
            teamCard.style.color = secondaryColor;

            // Create and append team logo
            const teamLogo = document.createElement("img");
            let teamId = team.id;
            const LogoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;
            teamLogo.src = LogoUrl;
            teamCard.appendChild(teamLogo);

            // Append the card to a container
            teamCardsContainer.appendChild(teamCard);

            teamCard.addEventListener("click", function () {
              const teamId = this.getAttribute("data-team-id");

              // Fetch roster for selected team
              fetch(
                `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`
              )
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
                    Array.from(document.querySelectorAll(".team-card")).forEach(
                      (el) => (el.style.display = "none")
                    );
                    backBtn.style.display = "block";

                    // playerCardsContainer.innerHTML += playerCard;
                    // Existing code where you create the playerCard string...
                    const playerCardContent = `
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

                    // Create an actual DOM element from the string
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = playerCardContent.trim();
                    const actualPlayerCard = tempDiv.firstChild;
                    const bodyElement = document.body;

                    // Style the player card
                    actualPlayerCard.style.backgroundColor = primaryColor;
                    actualPlayerCard.style.borderColor = secondaryColor;
                    actualPlayerCard.style.color = secondaryColor;
                    bodyElement.style.backgroundColor =
                      selectedTeamSecondaryColor;
                    selectedTeamPrimaryColor = primaryColor;
                    selectedTeamSecondaryColor = secondaryColor;
                    // Find the player's image element inside the card
                    const playerImage = actualPlayerCard.querySelector("img");

                    // Apply the primaryColor as the border color to the image
                    playerImage.style.border = `10px solid ${secondaryColor}`;

                    // Append the styled card to the container
                    playerCardsContainer.appendChild(actualPlayerCard);
                  });
                });
            });
          });
        });
    });

  backBtn.addEventListener("click", function () {
    // Hide player cards
    playerCardsContainer.innerHTML = "";

    // Show teams
    Array.from(document.querySelectorAll(".team-card")).forEach(
      (el) => (el.style.display = "block")
    );

    // Hide the back button
    backBtn.style.display = "none";
  });

  //Creates Player Modal when a player is clicked
  playerCardsContainer.addEventListener("click", function (event) {
    if (event.target.closest(".card")) {
      selectedPlayerId = event.target
        .closest(".card")
        .getAttribute("data-player-id");
      const playerId = selectedPlayerId;
      const playerImage = document.getElementById("player-image");
      const playerName = document.getElementById("modal-player-name");
      const teamLogo = document.getElementById("team-logo");
      const playerNumberAndPosition = document.getElementById(
        "player-number-and-position"
      );
      const playerAge = document.getElementById("player-age");
      const playerHeight = document.getElementById("player-height");
      const playerWeight = document.getElementById("player-weight");
      const playerHometown = document.getElementById("player-hometown");
      const playerHanded = document.getElementById("player-handed");

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
          playerAge.textContent = player.currentAge;
          playerHeight.textContent = player.height;
          playerWeight.textContent = player.weight;
          playerHometown.textContent = `${player.birthCity}, ${player.birthStateProvince}, ${player.birthCountry}`;
          playerHanded.textContent =
            (player.primaryPosition.name === "Goalie"
              ? " Catches: "
              : " Shoots: ") +
            (player.shootsCatches === "L" ? " Left" : " Right");

          // Get current season
          const currentYear = new Date().getFullYear();
          const lastYear = currentYear - 1;
          const season = `${lastYear}${currentYear}`;

          // Fetch initial season stats for the current season
          fetchStatsForSeason(playerId, season);

          // Populate the season dropdown based on the years the player has played
          populatePlayerSeasonsDropdown(playerId);
          const modalHeader = document.querySelector("#modal-header");
          modalHeader.style.backgroundColor = selectedTeamSecondaryColor;
          modalHeader.style.color = selectedTeamPrimaryColor;

          // If you have other elements to style:
          // const modalHeaderButton = modalHeader.querySelector('.header-button');
          // modalHeaderButton.style.backgroundColor = secondaryColor;

          // Show the modal
          modal.style.display = "block";
        });
    }
  });

  function fetchStatsForSeason(playerId, selectedSeason) {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=yearByYear`
    )
      .then((response) => response.json())
      .then((data) => {
        const splits = data.stats[0].splits;

        // Fetch stats for the selected season
        const seasonStats = splits.find(
          (split) => split.season === selectedSeason
        );

        // Determine the previous season
        const previousSeason = (parseInt(selectedSeason) - 10001).toString();

        // Fetch stats for the previous season
        const previousSeasonStats = splits.find(
          (split) => split.season === previousSeason
        );

        // Ensure both current and previous season stats are available
        if (
          seasonStats &&
          seasonStats.stat &&
          previousSeasonStats &&
          previousSeasonStats.stat
        ) {
          const currentGoals = seasonStats.stat.goals;
          const previousGoals = previousSeasonStats.stat.goals;

          // Calculate the difference in goals
          const stats = seasonStats.stat;
          const prevStats = previousSeasonStats.stat;

          // List of stats to compare
          const statsKeys = Object.keys(stats);

          let differences = {};

          statsKeys.forEach((key) => {
            let difference = stats[key] - (prevStats[key] || 0);
            let triangleDirection, color;

            if (difference > 0) {
              triangleDirection = "▲"; // Up triangle for improvement
              color = "green";
            } else if (difference < 0) {
              triangleDirection = "▼"; // Down triangle for decline
              color = "red";
            } else {
              triangleDirection = ""; // No triangle for no change
              color = "grey";
            }

            differences[key] = {
              difference: difference,
              triangle: triangleDirection,
              color: color,
            };
          });

          // Define the createStatString function here
          const createStatString = (stat, label) => {
            return stats[stat] !== undefined
              ? `<p>${label}: ${stats[stat]}</p>`
              : "";
          };

          // Construct and display the player stats
          let leagueName =
            seasonStats.league.name === "National Hockey League"
              ? "NHL"
              : seasonStats.league.name;
          const playerStats = `
          

<h3>Season ${selectedSeason.substring(0, 4)}-${selectedSeason.substring(
            4
          )} Stats - Played for ${
            seasonStats.team.name
          } in the ${leagueName}</h3>
<div class="player-stats"><div id="display-player-stats">

                    
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
                    </div><div id="metrics"><p style="color: ${
                      differences["games"].color
                    }">
${differences["games"].triangle} from Previous Season
</p>
<p style="color: ${differences["goals"].color}">
    ${differences["goals"].triangle} from Previous Season
</p>
<p style="color: ${differences["assists"].color}">
${differences["assists"].triangle} from Previous Season
</p>
<p style="color: ${differences["blocked"].color}">
${differences["blocked"].triangle} from Previous Season
</p>
<p style="color: ${differences["points"].color}">
${differences["points"].triangle} from Previous Season
</p>
<p style="color: ${differences["pim"].color}">
${differences["pim"].triangle} from Previous Season
</p>
</div></div>

                `;

          modalBody.innerHTML = playerStats;
        } else {
          modalBody.innerHTML = "No stats available for the selected season.";
        }
      });
  }

  function populatePlayerSeasonsDropdown(playerId) {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=yearByYear`
    )
      .then((response) => response.json())
      .then((data) => {
        const seasons = new Set();
        const splits = data.stats[0].splits;

        splits.forEach((split) => {
          const season = split.season;
          if (split.stat && (split.stat.points || split.stat.points === 0)) {
            seasons.add(season);
          }
        });

        const seasonSelect = document.getElementById("playerSeasonSelect");
        seasonSelect.innerHTML = ""; // clear previous options

        // Convert the Set to an array and sort it in descending order
        const sortedSeasons = Array.from(seasons).sort((a, b) => b - a);

        sortedSeasons.forEach((season) => {
          const option = document.createElement("option");
          option.value = season;
          option.textContent = `${season.substring(0, 4)}-${season.substring(
            4,
            8
          )}`;
          seasonSelect.appendChild(option);
        });

        // Activate the dropdown now that it's populated
        seasonSelect.removeAttribute("disabled");
      })
      .catch((error) => {
        console.error("Error fetching player seasons:", error);
      });
  }

  // Event listener for the season dropdown change
  seasonSelect.addEventListener("change", function () {
    if (selectedPlayerId) {
      fetchStatsForSeason(selectedPlayerId, this.value);
    }

    console.log(selectedPlayerId);
  });

  // Close the modal when the close button is clicked
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
    console.log("clicked");
  });

  // Close the modal when the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      console.log("clicked");
    }
  });
});
