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
                          <img src="https://nhl.bamcontent.com/images/headshots/current/168x168/${player.id}.png" 
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
                        <img src="https://nhl.bamcontent.com/images/headshots/current/168x168/${player.id}.png" 
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
          playerImage.src = `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.png`;
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

        // Determine the Previous Season
        const previousSeason = (parseInt(selectedSeason) - 10001).toString();
        const formattedPrevSeason = `${previousSeason
          .toString()
          .slice(0, 4)}-${previousSeason.toString().slice(4)}`;

        // Fetch stats for the ${formattedPrevSeason}
        const previousSeasonStats = splits.find(
          (split) => split.season === previousSeason
        );

        // Ensure both current and Previous Season stats are available
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
              triangleDirection = "↔"; // No triangle for no change
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
            let statValue;
            if (stats[stat] !== undefined) {
              // Check if the stat is a percentage stat and format it accordingly
              if (
                [
                  "savePercentage",
                  "evenStrengthSavePercentage",
                  "powerPlaySavePercentage",
                  "shortHandedSavePercentage",
                ].includes(stat)
              ) {
                statValue = parseFloat(stats[stat]).toFixed(2) + "%";
              } else {
                statValue = stats[stat];
              }
              return `<p>${label}: ${statValue}</p>`;
            } else {
              return "";
            }
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
<div class="player-stats" id="display-player-stats">

                    
${createStatString("games", "GP")}
${createStatString("wins", "W")}
${createStatString("losses", "L")}
${createStatString("ties", "T")}
${createStatString("ot", "OT")}
${createStatString("gamesStarted", "GS")}

${createStatString("goals", "G")}
${createStatString("assists", "A")}
${createStatString("points", "P")}
${createStatString("shotPct", "S%")}
${createStatString("shots", "S")}
${createStatString("shotsAgainst", "SA")}

${createStatString("powerPlayGoals", "PPG")}
${createStatString("powerPlayPoints", "PPP")}
${createStatString("shortHandedGoals", "SHG")}
${createStatString("shortHandedPoints", "SHP")}
${createStatString("gameWinningGoals", "GWG")}
${createStatString("overTimeGoals", "OTG")}

${createStatString("evenSaves", "ES")}
${createStatString("powerPlaySaves", "PPS")}
${createStatString("shortHandedSaves", "SHS")}
${createStatString("savePercentage", "SV%")}
${createStatString("evenStrengthSavePercentage", "ESV%")}
${createStatString("powerPlaySavePercentage", "PPSV%")}
${createStatString("shortHandedSavePercentage", "SHSV%")}
${createStatString("goalsAgainst", "GA")}
${createStatString("goalsAgainstAverage", "GAA")}
${createStatString("shutouts", "SO")}

${createStatString("pim", "PIM")}
${createStatString("penaltyMinutes", "PIM")}
${createStatString("hits", "H")}
${createStatString("blocked", "BS")}
${createStatString("plusMinus", "+/-")}
${createStatString("faceOffPct", "FO%")}
${createStatString("shifts", "Shifts")}

${createStatString("timeOnIce", "TOI")}
${createStatString("evenTimeOnIce", "ETOI")}
${createStatString("powerPlayTimeOnIce", "PPTOI")}
${createStatString("shortHandedTimeOnIce", "SHTOI")}
${createStatString("timeOnIcePerGame", "TOI/G")}
${createStatString("evenTimeOnIcePerGame", "ETOI/G")}

</div>
<div id="metrics">

${
  differences?.["games"]
    ? `<p style="color: ${differences["games"].color}">
    ${differences["games"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["wins"]
    ? `<p style="color: ${differences["wins"].color}">
    ${differences["wins"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["losses"]
    ? `<p style="color: ${differences["losses"].color}">
    ${differences["losses"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["ties"]
    ? `<p style="color: ${differences["ties"].color}">
    ${differences["ties"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["ot"]
    ? `<p style="color: ${differences["ot"].color}">
    ${differences["ot"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["gamesStarted"]
    ? `<p style="color: ${differences["gamesStarted"].color}">
    ${differences["gamesStarted"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["goals"]
    ? `<p style="color: ${differences["goals"].color}">
    ${differences["goals"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["assists"]
    ? `<p style="color: ${differences["assists"].color}">
    ${differences["assists"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["points"]
    ? `<p style="color: ${differences["points"].color}">
    ${differences["points"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shotPct"]
    ? `<p style="color: ${differences["shotPct"].color}">
    ${differences["shotPct"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shots"]
    ? `<p style="color: ${differences["shots"].color}">
    ${differences["shots"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shotsAgainst"]
    ? `<p style="color: ${differences["shotsAgainst"].color}">
    ${differences["shotsAgainst"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["powerPlayGoals"]
    ? `<p style="color: ${differences["powerPlayGoals"].color}">
    ${differences["powerPlayGoals"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["powerPlayPoints"]
    ? `<p style="color: ${differences["powerPlayPoints"].color}">
    ${differences["powerPlayPoints"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shortHandedGoals"]
    ? `<p style="color: ${differences["shortHandedGoals"].color}">
    ${differences["shortHandedGoals"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shortHandedPoints"]
    ? `<p style="color: ${differences["shortHandedPoints"].color}">
    ${differences["shortHandedPoints"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["gameWinningGoals"]
    ? `<p style="color: ${differences["gameWinningGoals"].color}">
    ${differences["gameWinningGoals"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["overTimeGoals"]
    ? `<p style="color: ${differences["overTimeGoals"].color}">
    ${differences["overTimeGoals"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["evenSaves"]
    ? `<p style="color: ${differences["evenSaves"].color}">
    ${differences["evenSaves"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["powerPlaySaves"]
    ? `<p style="color: ${differences["powerPlaySaves"].color}">
    ${differences["powerPlaySaves"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shortHandedSaves"]
    ? `<p style="color: ${differences["shortHandedSaves"].color}">
    ${differences["shortHandedSaves"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["savePercentage"]
    ? `<p style="color: ${differences["savePercentage"].color}">
    ${differences["savePercentage"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["evenStrengthSavePercentage"]
    ? `<p style="color: ${differences["evenStrengthSavePercentage"].color}">
    ${differences["evenStrengthSavePercentage"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["powerPlaySavePercentage"]
    ? `<p style="color: ${differences["powerPlaySavePercentage"].color}">
    ${differences["powerPlaySavePercentage"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shortHandedSavePercentage"]
    ? `<p style="color: ${differences["shortHandedSavePercentage"].color}">
    ${differences["shortHandedSavePercentage"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["goalsAgainst"]
    ? `<p style="color: ${differences["goalsAgainst"].color}">
    ${differences["goalsAgainst"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["goalsAgainstAverage"]
    ? `<p style="color: ${differences["goalsAgainstAverage"].color}">
    ${differences["goalsAgainstAverage"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shutouts"]
    ? `<p style="color: ${differences["shutouts"].color}">
    ${differences["shutouts"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["pim"]
    ? `<p style="color: ${differences["pim"].color}">
    ${differences["pim"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["penaltyMinutes"]
    ? `<p style="color: ${differences["penaltyMinutes"].color}">
    ${differences["penaltyMinutes"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["hits"]
    ? `<p style="color: ${differences["hits"].color}">
    ${differences["hits"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["blocked"]
    ? `<p style="color: ${differences["blocked"].color}">
    ${differences["blocked"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["plusMinus"]
    ? `<p style="color: ${differences["plusMinus"].color}">
    ${differences["plusMinus"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["faceOffPct"]
    ? `<p style="color: ${differences["faceOffPct"].color}">
    ${differences["faceOffPct"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shifts"]
    ? `<p style="color: ${differences["shifts"].color}">
    ${differences["shifts"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["timeOnIce"]
    ? `<p style="color: ${differences["timeOnIce"].color}">
    ${differences["timeOnIce"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["evenTimeOnIce"]
    ? `<p style="color: ${differences["evenTimeOnIce"].color}">
    ${differences["evenTimeOnIce"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["powerPlayTimeOnIce"]
    ? `<p style="color: ${differences["powerPlayTimeOnIce"].color}">
    ${differences["powerPlayTimeOnIce"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["shortHandedTimeOnIce"]
    ? `<p style="color: ${differences["shortHandedTimeOnIce"].color}">
    ${differences["shortHandedTimeOnIce"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["timeOnIcePerGame"]
    ? `<p style="color: ${differences["timeOnIcePerGame"].color}">
    ${differences["timeOnIcePerGame"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

${
  differences?.["evenTimeOnIcePerGame"]
    ? `<p style="color: ${differences["evenTimeOnIcePerGame"].color}">
    ${differences["evenTimeOnIcePerGame"].triangle} from ${formattedPrevSeason}
</p>`
    : ""
}

</div>

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
