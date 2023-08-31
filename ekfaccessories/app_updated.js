// Function to fetch data and populate the page
function fetchDataAndPopulate() {
  fetch("data.json")
    .then((response) => response.json())
    .then((jsonData) => {
      const accessoriesDiv = document.getElementById("accessories");
      const navbar = document.querySelector(".navbar");

      jsonData.forEach((accessory, index) => {
        // Create Section
        const section = document.createElement("section");
        section.id = `section-${index}`;
        section.className = "scroll-section";
        section.innerHTML = `
          <h2>${accessory.name}</h2>
          <img src="${accessory.imageUrl}" alt="${accessory.name}">
        `;

        // Create Info Button
        const infoBtn = document.createElement("button");
        infoBtn.className = "info-btn";
        infoBtn.setAttribute("data-description", accessory.description);
        infoBtn.setAttribute("data-price", accessory.price);
        infoBtn.setAttribute("data-var1", accessory.var1 || "");
        infoBtn.setAttribute("data-var2", accessory.var2 || "");
        infoBtn.setAttribute("data-var3", accessory.var3 || "");
        infoBtn.setAttribute("data-var4", accessory.var4 || "");
        infoBtn.innerText = "Details";

        // Append Button to Section
        section.appendChild(infoBtn);

        // Append Section to Div
        accessoriesDiv.appendChild(section);

        // Create Navigation Link
        const navLink = document.createElement("a");
        navLink.href = `#section-${index}`;
        navLink.innerText = accessory.name;
        navLink.addEventListener("click", (event) => {
          event.preventDefault();
          document
            .querySelector(event.target.getAttribute("href"))
            .scrollIntoView({ behavior: "auto" });

          // Remove active class from navbar when link is clicked
          var navbar = document.querySelector(".navbar");
          navbar.classList.remove("active");
        });
        navbar.appendChild(navLink);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to toggle the navigation bar
function toggleNavbar() {
  var navbar = document.querySelector(".navbar");
  navbar.classList.toggle("active");
}

// Fetch data and populate the page when the DOM is ready
document.addEventListener("DOMContentLoaded", fetchDataAndPopulate);

// Modal Logic
const modal = document.getElementById("infoModal");
const modalDescription = document.getElementById("modalDescription");
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("info-btn")) {
    modalDescription.innerText = event.target.getAttribute("data-description");
    document.getElementById("modalPrice").innerText =
      // "Price: $" +
      event.target.getAttribute("data-price");

    // Check and set var1, var2, var3, var4
    ["var1", "var2", "var3", "var4"].forEach((varName) => {
      const value = event.target.getAttribute(`data-${varName}`);
      if (value) {
        document.getElementById(varName).innerText = `${value}`;
      } else {
        document.getElementById(varName).innerText = "";
      }
    });

    modal.style.display = "block";
  } else if (event.target.classList.contains("close-btn")) {
    modal.style.display = "none";
  }
});

// Close modal if clicked outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
