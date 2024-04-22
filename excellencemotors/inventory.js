let currentData = [];
let filteredData = [];
const itemsPerPage = 10;
let currentPage = 1;
let filterDebounce;

document.addEventListener('DOMContentLoaded', function () {
    fetch("inventory.json")
        .then(response => response.json())
        .then(data => {
            currentData = data;
            renderPage(currentData);  // Initial render
            setupCardClickEvents();  // Set up card interactions
            populateFilterOptions(currentData); // Setup initial dropdown values
            // applyFilters(); // Apply initial filters if needed
        })
        .catch(error => console.error("Error loading the inventory data:", error));
});

  


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
    const url = `https://api.fuelapi.com/v1/json/vehicle/${vehicleId}?productID=1&productFormatIDs=1&shotCode=046&api_key=${apiKey}`;

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
            return 'comingsoon.jpg'; // Fallback image
        }
    } catch (error) {
        console.error('Error fetching vehicle image:', error);
        return 'comingsoon.jpg'; // Fallback image
    }
}


async function renderPage(data) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);
    const inventoryContainer = document.getElementById("inventory-container");
  
    inventoryContainer.innerHTML = ""; // Clear existing content
    const fragment = document.createDocumentFragment();
  
    // Store promises from each vehicle card processing
    const cardPromises = pageData.map(vehicle => processVehicleCard(vehicle));
  
    // Wait for all vehicle card promises to resolve and then append them to the fragment
    const cards = await Promise.all(cardPromises);
    cards.forEach(card => {
      if (card) fragment.appendChild(card);
    });
  
    inventoryContainer.appendChild(fragment);
    // setupClickEvents(data);
}

async function processVehicleCard(vehicle) {
    try {
        // Search for the vehicle ID using the vehicle's details
        const vehicleId = await searchVehicle(vehicle.Year, vehicle.Make, vehicle.Model);
        if (!vehicleId) {
            throw new Error('Vehicle ID not found');
        }

        // Fetch the image URL using the vehicle ID obtained from the search
        const imageUrl = await fetchVehicleImage(vehicleId);

        // Create the card element with the vehicle's details and image
        const cardElement = document.createElement("div");
        cardElement.className = "col-md-4 mb-3 card";
        cardElement.setAttribute('data-vehicle-id', vehicleId);  // Use the vehicle ID as data attribute for identification
        cardElement.innerHTML = `
            <img src="${imageUrl}" class="card-img-top" alt="${vehicle.Model}">
            <div class="card-body">
                <h5 class="card-title">${vehicle.Year} ${vehicle.Make} ${vehicle.Model}</h5>
                <p class="card-text">${vehicle.Trim}</p>
                <p class="card-text">$${vehicle.Price}</p>
                <p class="card-text">${vehicle.Vin}  -  ${vehicle['Stock#']}</p>
                <p class="card-text">More Info</p>
            </div>
        `
        cardElement.setAttribute('data-year', vehicle.Year);
cardElement.setAttribute('data-make', vehicle.Make);
cardElement.setAttribute('data-model', vehicle.Model);
cardElement.setAttribute('data-trim', vehicle.Trim);
cardElement.setAttribute('data-color', vehicle['Ext. Color']);;
        return cardElement;
    } catch (error) {
        console.error("Error processing vehicle card:", error);
        return null; // Return null to signify failure to process this card
    }
}



function setupCardClickEvents() {
    const container = document.getElementById('inventory-container');
    container.addEventListener('click', function(event) {
        const card = event.target.closest('.card');
        if (card) {
            const vehicleId = card.getAttribute('data-vehicle-id');
            const year = card.getAttribute('data-year');
            const make = card.getAttribute('data-make');
            const model = card.getAttribute('data-model');
            const trim = card.getAttribute('data-trim');
            const color = card.getAttribute('data-color');
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            
            // Set the modal title
            const modalTitle = document.getElementById('modal-title');
            modalTitle.textContent = `${year} ${make} ${model} ${trim} - ${color}`;
            modalTitle.style.color = 'black'; // Set the text color to black

            modal.show();
            displayLoading(true);
            fetchVehicleImages(vehicleId)
                .then(() => displayLoading(false))
                .catch(error => {
                    console.error('Error fetching vehicle images:', error);
                    displayLoading(false);
                });
        }
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

function populateDropdowns(filteredData, typeFilter, yearFilter, makeFilter, modelFilter) {
    const types = [...new Set(filteredData.map(item => item.Type))].sort();
    const years = [...new Set(filteredData.map(item => item.Year.toString()))].sort((a, b) => b - a);
    const makes = [...new Set(filteredData.map(item => item.Make))].sort();
    const models = [...new Set(filteredData.map(item => item.Model))].sort();

    updateDropdown("filter-type", types, typeFilter);
    updateDropdown("filter-year", years, yearFilter);
    updateDropdown("filter-make", makes, makeFilter);
    updateDropdown("filter-model", models, modelFilter);
}

function updateDropdown(dropdownId, options, currentValue) {
    const select = document.getElementById(dropdownId);
    select.innerHTML = '<option value="">All</option>'; // Reset options
    options.forEach(option => {
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

function resetFilters() {
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-year').value = '';
    document.getElementById('filter-make').value = '';
    document.getElementById('filter-model').value = '';
    applyFilters(); // Reapply filters to reset the display
}




async function fetchVehicleImages(vehicleId) {
    const apiKey = "daefd14b-9f2b-4968-9e4d-9d4bb4af01d1";
    const url = `https://api.fuelapi.com/v1/json/vehicle/${vehicleId}/?api_key=${apiKey}&productID=1&productFormatID=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error('Failed to fetch images');

    populateCarousel(extractImageUrls(data.products));
}

function extractImageUrls(products) {
    return products.flatMap(product =>
        product.productFormats.flatMap(format =>
            format.assets.map(asset => asset.url)
        )
    );
}

function populateCarousel(imageUrls) {
    const carouselInner = document.getElementById('carouselImages');
    carouselInner.innerHTML = '';
    imageUrls.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${url}" class="d-block w-100" alt="Vehicle Image">`;
        carouselInner.appendChild(item);
    });
}

function displayLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const carousel = document.getElementById('carouselExampleIndicators');
    loadingIndicator.style.display = show ? 'flex' : 'none';
    carousel.style.display = show ? 'none' : 'block';
}
