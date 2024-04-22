let currentData = [];
let filteredData = [];
const itemsPerPage = 2;
let currentPage = 1;
let filterDebounce;

document.addEventListener("DOMContentLoaded", function () {
  fetch("inventory.json")
    .then((response) => response.json())
    .then((data) => {
      currentData = data; // Store the full inventory data globally or in a suitable scope
      applyFilters(); // Apply filters initially to populate dropdowns and render the page
    })
    .catch((error) =>
      console.error("Error loading the inventory data: ", error)
    );
});

// async function fetchVehicleData(vehicleId) {
//   const apiKey = "daefd14b-9f2b-4968-9e4d-9d4bb4af01d1";
//   const url = `https://api.fuelapi.com/v1/json/vehicle/${vehicleId}?productID=1&productFormatIDs=1&shotCode=037&api_key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     displayVehicleDetails(data);
//   } catch (error) {
//     console.error("Error fetching vehicle data:", error);
//   }
// }

// function displayVehicleDetails(data) {
//   const vehicleContainer = document.getElementById("vehicle-info");
//   const imageContainer = document.getElementById("vehicle-image");

//   const vehicleDetails = `
//         <h3>${data.model.make.name} ${data.model.name} ${data.model.year} - ${data.trim}</h3>
//         <p>Doors: ${data.num_doors}, Drivetrain: ${data.drivetrain}, Body type: ${data.bodytype}</p>
//         <p>Trim: ${data.trim}</p>
//     `;

//   vehicleContainer.innerHTML = vehicleDetails;

//   // Assuming that there's always at least one product and one product format with at least one asset
//   const imageUrl = data.products[0].productFormats[0].assets[0].url;
//   imageContainer.src = imageUrl;
//   imageContainer.alt = `${data.model.make.name} ${data.model.name} - ${data.products[0].productFormats[0].assets[0].shotCode.description}`;
// }

async function searchVehicle(year, make, model, body='', doors='', drive='', trim='') {
    const apiKey = "daefd14b-9f2b-4968-9e4d-9d4bb4af01d1";
    let url = `https://api.fuelapi.com/v1/json/vehicles/?api_key=${apiKey}&year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

    if (body) url += `&body=${encodeURIComponent(body)}`;
    if (doors) url += `&doors=${doors}`;
    if (drive) url += `&drive=${encodeURIComponent(drive)}`;
    if (trim !== undefined) url += `&trim=${encodeURIComponent(trim)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.length > 0) {
            console.log('Vehicle ID:', data[0].id);  // Corrected to access the 'id' directly
            return data[0].id;  // Return the first vehicle's ID as the correct one
        } else {
            console.log('Search result:', data);  // Helpful to see what the API returned in case of no results
            throw new Error('No vehicles found with the specified criteria');
        }
    } catch (error) {
        console.error("Error searching for vehicle:", error);
        return null;  // Return null to indicate that the search failed
    }
}


async function fetchVehicleImage(vehicleId) {
    const apiKey = "daefd14b-9f2b-4968-9e4d-9d4bb4af01d1";
    const url = `https://api.fuelapi.com/v1/json/vehicle/${vehicleId}?productID=1&productFormatIDs=1&shotCode=037&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (data.products && data.products.length > 0 && data.products[0].productFormats && data.products[0].productFormats.length > 0 && data.products[0].productFormats[0].assets && data.products[0].productFormats[0].assets.length > 0) {
            const imageUrl = data.products[0].productFormats[0].assets[0].url;
            console.log('Image URL:', imageUrl);
            return imageUrl;
        } else {
            console.error('No URL in response', data);
            return 'path/to/default_image.jpg'; // Fallback image
        }
    } catch (error) {
        console.error('Error fetching vehicle image:', error);
        return 'path/to/default_image.jpg'; // Fallback image
    }
}

// async function renderPage(data) {
//     const start = (currentPage - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     const pageData = data.slice(start, end);
//     const inventoryContainer = document.getElementById("inventory-container");

//     // Clear existing content
//     inventoryContainer.innerHTML = '';

//     // Map each vehicle data to a promise that resolves to card HTML
//     const cardPromises = pageData.map(async vehicle => {
//         try {
//             // Fetch image URL using the vehicle ID obtained from search
//             const imageUrl = await fetchVehicleImage(vehicle.id); // Ensure you are using the correct vehicle ID key
//             // Return the HTML string for the card
//             return `
//                 <div class="col-md-4 mb-3">
//                     <div class="card h-100" id="${vehicle.id}">
//                         <img src="${imageUrl}" class="card-img-top" alt="${vehicle.model}">
//                         <div class="card-body">
//                             <h5 class="card-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h5>
//                             <p class="card-text">${vehicle.trim}</p>
//                             <p class="card-text">Price: $${vehicle.price}</p>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         } catch (error) {
//             console.error('Error processing vehicle:', vehicle.id, error);
//             return '';  // Return empty string or default card on error
//         }
//     });

//     // Wait for all card HTML promises to resolve
//     const cards = await Promise.all(cardPromises);
//     console.log('Cards ready to append:', cards.length);
// cards.forEach(cardHTML => {
//     if (cardHTML) {
//         console.log('Appending card:', cardHTML);
//         const tempContainer = document.createElement('div');
//         tempContainer.innerHTML = cardHTML;
//         inventoryContainer.appendChild(tempContainer.firstChild);
//     } else {
//         console.log('Empty or invalid cardHTML encountered');
//     }
// });

// async function renderPage(data) {
//     const start = (currentPage - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     const pageData = data.slice(start, end);
//     const inventoryContainer = document.getElementById("inventory-container");

//     // Clear existing content
//     inventoryContainer.innerHTML = '';

//     // Map each vehicle data to a promise that resolves to card HTML
//     const cards = pageData.map(vehicle => {
//         return `
//             <div class="col-md-4 mb-3">
//                 <div class="card h-100" id="${vehicle.id}">
//                     <img src="path/to/static_image.jpg" class="card-img-top" alt="${vehicle.model}">
//                     <div class="card-body">
//                         <h5 class="card-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h5>
//                         <p class="card-text">${vehicle.trim}</p>
//                         <p class="card-text">Price: $${vehicle.price}</p>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });
    
//     // Append static cards to verify the DOM manipulation
//     cards.forEach(cardHTML => {
//         const tempContainer = document.createElement('div');
//         tempContainer.innerHTML = cardHTML;
//         inventoryContainer.appendChild(tempContainer.firstChild);
    
    
// });


//     // Setup click events after all cards are rendered
//     setupClickEvents(data);
// }



async function renderPage(data) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = data.slice(start, end);
  const inventoryContainer = document.getElementById("inventory-container");

  // Clear existing content
  inventoryContainer.innerHTML = "";

  // Create a document fragment to batch DOM updates
  const fragment = document.createDocumentFragment();

  for (const vehicle of pageData) {
    // Use a self-invoking async function to handle each vehicle individually
    (async () => {
      try {
        // First, find the vehicle ID by searching
        const vehicleId = await searchVehicle(
          vehicle.Year,
          vehicle.Make,
          vehicle.Model
        );
        // Then, fetch the image for that vehicle ID
        const imageUrl = vehicleId
          ? await fetchVehicleImage(vehicleId)
          : "car.jpg";

        // Create the card element with the image
        const cardElement = document.createElement("div");
        cardElement.className = "col-md-4 mb-3";
        cardElement.innerHTML = `
                    <div class="card h-100" id="${vehicle["Stock#"]}">
                        <img src="${imageUrl}" class="card-img-top" alt="${vehicle.Model}">
                        <div class="card-body">
                            <h5 class="card-title">${vehicle.Year} ${vehicle.Make} ${vehicle.Model}</h5>
                            <p class="card-text">${vehicle.Trim}</p>
                            <p class="card-text">Price: $${vehicle.Price}</p>
                        </div>
                    </div>
                `;
        fragment.appendChild(cardElement);
      } catch (error) {
        console.error("Error processing vehicle:", vehicle["Stock#"], error);
      }
    })();
  }

  // Once all cards are processed, append them to the container
  inventoryContainer.appendChild(fragment);
  // Setup click events after all cards are rendered
  setupClickEvents(data);
}

function setupClickEvents(data) {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      const vehicleDetails = data.find((v) => v["Stock#"] === this.id);
      const modalBody = document.querySelector(".modal-body");
      modalBody.innerHTML = `
                <img src="car.jpg" class="card-img-top" alt="${vehicleDetails.Model}">
                <h5>${vehicleDetails.Year} ${vehicleDetails.Make} ${vehicleDetails.Model}</h5>
                <p>${vehicleDetails.Trim} - ${vehicleDetails["Ext. Color"]}</p>
                <p>Price: $${vehicleDetails.Price} Miles: ${vehicleDetails.Miles}</p>
                <p>VIN: ${vehicleDetails.Vin} - Stock #: ${vehicleDetails["Stock#"]}</p>
            `;
      new bootstrap.Modal(document.getElementById("vehicleModal")).show();
    });
  });
}

function changePage(direction) {
  currentPage += direction;
  renderPage(filteredData.length > 0 ? filteredData : currentData);
}

function applyFilters() {
  // Retrieve current filter values from dropdowns
  const typeFilter = document.getElementById("filter-type").value;
  const yearFilter = document.getElementById("filter-year").value;
  const makeFilter = document.getElementById("filter-make").value;
  const modelFilter = document.getElementById("filter-model").value;

  // Apply filters to the currentData
  filteredData = currentData.filter((vehicle) => {
    return (
      (typeFilter === "" || vehicle.Type === typeFilter) &&
      (yearFilter === "" || vehicle.Year.toString() === yearFilter) &&
      (makeFilter === "" || vehicle.Make === makeFilter) &&
      (modelFilter === "" || vehicle.Model === modelFilter)
    );
  });

  // Update dropdowns to reflect current filtered data
  populateDropdowns(
    filteredData,
    typeFilter,
    yearFilter,
    makeFilter,
    modelFilter
  );

  // Reset the currentPage and render the filtered data
  currentPage = 1;
  renderPage(filteredData);
}

function populateDropdowns(
  filteredData,
  typeFilter,
  yearFilter,
  makeFilter,
  modelFilter
) {
  const types = new Set(filteredData.map((item) => item.Type));
  const years = new Set(filteredData.map((item) => item.Year.toString()));
  const makes = new Set(filteredData.map((item) => item.Make));
  const models = new Set(filteredData.map((item) => item.Model));

  updateDropdown("filter-type", types, typeFilter);
  updateDropdown("filter-year", years, yearFilter);
  updateDropdown("filter-make", makes, makeFilter);
  updateDropdown("filter-model", models, modelFilter);
}

function updateDropdown(dropdownId, options, currentValue) {
  const select = document.getElementById(dropdownId);
  select.innerHTML = '<option value="">All</option>'; // Reset options
  options.forEach((option) => {
    const selected = option === currentValue ? " selected" : "";
    select.innerHTML += `<option value="${option}"${selected}>${option}</option>`;
  });
}

function updateDropdown(dropdownId, options, currentValue) {
  const select = document.getElementById(dropdownId);
  select.innerHTML = `<option value="">All</option>`; // Reset options
  options.forEach((option) => {
    const selected = option === currentValue ? " selected" : "";
    select.innerHTML += `<option value="${option}"${selected}>${option}</option>`;
  });
}

function populateFilterOptions(data) {
  let types = new Set();
  let years = new Set();
  let makes = new Set();
  let models = new Set();

  data.forEach((vehicle) => {
    if (vehicle.Type) types.add(vehicle.Type);
    if (vehicle.Year) years.add(vehicle.Year.toString()); // Convert to string for consistency
    if (vehicle.Make) makes.add(vehicle.Make);
    if (vehicle.Model) models.add(vehicle.Model);
  });

  populateDropdown("filter-type", types);
  populateDropdown("filter-year", years);
  populateDropdown("filter-make", makes);
  populateDropdown("filter-model", models);
}

function populateDropdown(id, options) {
  const select = document.getElementById(id);
  options.forEach((option) => {
    select.innerHTML += `<option value="${option}">${option}</option>`;
  });
}

function applyFiltersDebounced() {
  clearTimeout(filterDebounce);
  filterDebounce = setTimeout(applyFilters, 300); // Adjust delay as needed
}
