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
                      <img src="${accessory.imageUrl}" alt="${accessory.name}" >
                      
                      <button class="info-btn" data-description="${accessory.description}" data-price="${accessory.price}">Details</button>
                  `;
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

function toggleNavbar() {
  var navbar = document.querySelector(".navbar");
  navbar.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", fetchDataAndPopulate);

// ... (rest of your JS code, like the modal logic, remains unchanged)

document.addEventListener("DOMContentLoaded", fetchDataAndPopulate);

// Modal Logic
const modal = document.getElementById("infoModal");
const modalDescription = document.getElementById("modalDescription");
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("info-btn")) {
    modalDescription.innerText = event.target.getAttribute("data-description");
    document.getElementById("modalPrice").innerText =
      "Price: $" + event.target.getAttribute("data-price");
    modal.style.display = "block";
  } else if (event.target.classList.contains("close-btn")) {
    modal.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
