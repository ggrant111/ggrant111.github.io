// Load templates from the templates.json file
fetch("templates.json")
  .then((response) => response.json())
  .then((data) => {
    // Store the loaded templates in the templates variable
    const templates = data;

    // Add event listeners and rest of your code using the templates variable
    document
      .getElementById("generateBtn")
      .addEventListener("click", generateMadLib);
    document.getElementById("readBtn").addEventListener("click", readMadLib);
    document
      .getElementById("viewHistoryBtn")
      .addEventListener("click", openHistoryModal);

    const historyList = document.getElementById("historyList");
    const historyModal = document.getElementById("historyModal");
    const closeBtn = historyModal.getElementsByClassName("close")[0];

    closeBtn.addEventListener("click", closeHistoryModal);

    // Load history from localStorage when the page loads
    window.addEventListener("load", loadHistoryFromLocalStorage);

    function generateMadLib() {
      const template = getSelectedTemplate();
      const placeholders = getPlaceholdersFromTemplate(template.content);

      const values = [];
      placeholders.forEach((placeholder) => {
        const value = prompt(`Enter a ${placeholder.toLowerCase()}:`);
        values.push(value);
      });

      const replacedStory = replacePlaceholders(template.content, values);
      const madLibResult = document.getElementById("madLibResult");
      madLibResult.innerHTML = replacedStory;

      updateHistoryList(replacedStory);
    }

    let isReading = false;

    function readMadLib() {
      if (isReading) {
        return; // Return early if already reading
      }

      const madLibText = document.getElementById("madLibResult").textContent;
      if (madLibText) {
        isReading = true;

        const speech = new SpeechSynthesisUtterance(madLibText);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onend = () => {
          isReading = false; // Reset the flag when reading is complete
        };

        window.speechSynthesis.speak(speech);
      }
    }

    function updateHistoryList(title, story) {
        const entryContainer = document.createElement("div");
      
        const titleElement = document.createElement("h3");
        titleElement.textContent = title;
        entryContainer.appendChild(titleElement);
      
        const contentElement = document.createElement("p");
        contentElement.textContent = story;
        entryContainer.appendChild(contentElement);
      
        const li = document.createElement("li");
        li.appendChild(entryContainer);
        historyList.appendChild(li);
      
        if (historyList.children.length > 10) {
          historyList.removeChild(historyList.children[0]);
        }
      
        // Save updated history list to localStorage
        saveHistoryToLocalStorage();
      }
      


    function openHistoryModal() {
      historyModal.style.display = "block";
    }

    function closeHistoryModal() {
      historyModal.style.display = "none";
    }

    function loadHistoryFromLocalStorage() {
      const savedHistory = localStorage.getItem("madLibsHistory");
      if (savedHistory) {
        const historyArray = JSON.parse(savedHistory);
        historyArray.forEach((story) => {
          updateHistoryList(story);
        });
      }
    }

    loadHistoryFromLocalStorage();

    function saveHistoryToLocalStorage() {
      const historyArray = Array.from(historyList.children).map(
        (li) => li.textContent
      );
      localStorage.setItem("madLibsHistory", JSON.stringify(historyArray));
    }

    function getSelectedTemplate() {
      const randomIndex = Math.floor(Math.random() * templates.length);
      return templates[randomIndex];
    }
    function getPlaceholdersFromTemplate(templateContent) {
      const placeholders = templateContent.match(/\{\{[^\}]+\}\}/g);
      if (placeholders) {
        return placeholders.map((placeholder) => placeholder.slice(1, -1));
      }
      return [];
    }
    function replacePlaceholders(templateContent, values) {
      let replacedContent = templateContent;

      values.forEach((value) => {
        replacedContent = replacedContent.replace(/\{\{[^\}]+\}\}/, value);
      });

      return replacedContent;
    }

    // ... rest of your code ...
  })
  .catch((error) => {
    console.error("Error loading templates:", error);
  });
