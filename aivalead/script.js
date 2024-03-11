function generateXML() {
  // Setting default placeholder values
  const defaultValues = {
    prospectStatus: "new",
    firstName: "Jeremy",
    lastName: "Day",
    email: "drew.doran+jdjd@roadster.com",
    phone: "(760) 889-0428",
    phoneTime: "nopreference",
    street: "Not Specified",
    city: "MIAMI",
    regionCode: "FL",
    postalCode: "33134",
    country: "US",
    customerID: "157125709",
    comments: "This is a test lead from the Universal Team",
    providerID: "-1",
    providerName: "Roadster Online",
  };

  // Collecting input values or using default if empty
  const prospectStatus =
    document.getElementById("prospectStatus").value ||
    defaultValues.prospectStatus;
  const firstName =
    document.getElementById("firstName").value || defaultValues.firstName;
  const lastName =
    document.getElementById("lastName").value || defaultValues.lastName;
  const email = document.getElementById("email").value || defaultValues.email;
  const phone = document.getElementById("phone").value || defaultValues.phone;
  const phoneTime =
    document.getElementById("phoneTime").value || defaultValues.phoneTime;
  const street =
    document.getElementById("street").value || defaultValues.street;
  const city = document.getElementById("city").value || defaultValues.city;
  const regionCodeValue = document.getElementById("regionCode").value;
  const stateAbbreviationValue =
    document.getElementById("stateAbbreviation").value;
  const postalCode = document.getElementById("postalCode").value || defaultValues.postalCode;
  const country =
    document.getElementById("country").value || defaultValues.country;
  const customerID =
    document.getElementById("customerID").value || defaultValues.customerID;
  const comments =
    document.getElementById("comments").value || defaultValues.comments;
  const providerID =
    document.getElementById("providerID").value || defaultValues.providerID;
  const providerName =
    document.getElementById("providerName").value || defaultValues.providerName;

  // Generating the current timestamp for requestDate
  const requestDate = new Date().toISOString();
// Attempt to parse the selected vehicle's information safely
let selectedVehicle;
const selectedVehicleJSON = document.getElementById('vehicleSelection').value;

// Check if selectedVehicleJSON is not empty and is a valid JSON string
if (selectedVehicleJSON) {
    try {
        selectedVehicle = JSON.parse(selectedVehicleJSON);
    } catch (error) {
        console.error('Error parsing selected vehicle data:', error);
        // Handle the error, e.g., by setting selectedVehicle to a default value or notifying the user
        selectedVehicle = null; // Example default value, adjust as needed
    }
} else {
    // Handle cases where no vehicle is selected (e.g., the initial dropdown state)
    selectedVehicle = null; // Adjust based on how you want to handle this scenario
}

// Continue with XML generation...
// Ensure you check selectedVehicle is not null before attempting to access its properties
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?adf version="1.0"?>
<adf>
<prospect status="${prospectStatus}">
<requestdate>${requestDate}</requestdate>
${selectedVehicle ? `<vehicle interest="buy" status="used">
<year>${selectedVehicle.year}</year>
<make>${selectedVehicle.make}</make>
<model>${selectedVehicle.model}</model>
<vin>${selectedVehicle.vin}</vin>
<stock>${selectedVehicle.stock}</stock>
<trim>${selectedVehicle.trim}</trim>
<transmission>${selectedVehicle.transmission}</transmission>
</vehicle>` : ''}
<customer>
<contact primarycontact="1">
<name part="first" type="individual">${firstName}</name>
<name part="last" type="individual">${lastName}</name>
<email>${email}</email>
<phone type="home">${phone}</phone>
<phone type="cellphone">${phone}</phone>
<phone type="work">${phone}</phone>
<address type="home">
<street line="1">${street}</street>
<city>${city}</city>
<regioncode>${stateAbbreviationValue}</regioncode>
<postalcode>${postalCode}</postalcode>
<country>${country}</country> 
</address>
</contact>
<comments>${comments}</comments>
</customer>
<provider>
<id sequence="0">${providerID}</id>
<name part="full" type="business">${providerName}</name>
</provider>
</prospect>
</adf>`;

  // Display the XML string in the modal's textarea instead of the form's textarea
  document.getElementById("modalXmlOutput").value = xml;

  // Show the modal
  const modal = document.getElementById("xmlModal");
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
const span = document.getElementsByClassName("close-button")[0];
span.onclick = function () {
  const modal = document.getElementById("xmlModal");
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modal = document.getElementById("xmlModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.getElementById("copyButton").addEventListener("click", function () {
  const xmlContent = document.getElementById("modalXmlOutput").value;
  // Encode the XML content to ensure it's safe to include in a URI
  const encodedXml = encodeURIComponent(xmlContent);

  // Construct the mailto link with the encoded XML content
  const mailtoLink = `mailto:excellencemotors@eleadtrack.net?subject=New Lead&body=${encodedXml}`;

  // Open the default email application with the prepared link
  // window.open(mailtoLink, '_blank');
  window.location.href = mailtoLink;
});

document
  .getElementById("universalMotors")
  .addEventListener("click", function () {
    const xmlContent = document.getElementById("modalXmlOutput").value;
    // Encode the XML content to ensure it's safe to include in a URI
    const encodedXml = encodeURIComponent(xmlContent);

    // Construct the mailto link with the encoded XML content
    const mailtoLink = `mailto:excellencegm@eleadtrack.net?subject=New Lead&body=${encodedXml}`;

    // Open the default email application with the prepared link
    // window.open(mailtoLink, '_blank');
    window.location.href = mailtoLink;
  });


document
  .getElementById("fetchRandomLead")
  .addEventListener("click", function () {
    fetch("https://randomuser.me/api/?nat=us")
      .then((response) => response.json())
      .then((data) => {
        const lead = data.results[0];
        const stateFullName = lead.location.state
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
        const stateAbbreviation = stateAbbreviations[stateFullName];

        // Now use the stateAbbreviation for the form
        document.getElementById("stateAbbreviation").value =
          stateAbbreviation || "Unknown"; // Fallback in case no match is found

        // Update other form fields with fetched data
        document.getElementById("firstName").value = lead.name.first;
        document.getElementById("lastName").value = lead.name.last;
        document.getElementById("email").value = lead.email;
        document.getElementById("phone").value = lead.phone;
        document.getElementById(
          "street"
        ).value = `${lead.location.street.number} ${lead.location.street.name}`;
        document.getElementById("city").value = lead.location.city;
        document.getElementById('postalCode').value = lead.location.postcode;
        // Optionally remove or use differently, since you're using abbreviations now
        // document.getElementById('regionCode').value = lead.location.state;
      })
      .catch((error) => console.error("Error fetching random lead:", error));
  });

document
  .getElementById("sendParsedLead")
  .addEventListener("click", function () {
    const leadEmail = document
      .getElementById("leadParsingAddress")
      .value.trim();
    if (!leadEmail) {
      alert("Please enter a lead parsing email address.");
      return;
    }

    const xmlContent = document.getElementById("modalXmlOutput").value;
    const subject = encodeURIComponent("New Lead");
    const body = encodeURIComponent(xmlContent);

    // Constructing the mailto link with user input for the lead parsing address
    const mailtoLink = `mailto:${leadEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink; // Open the default email client with pre-filled details
  });

document
  .getElementById("copyToClipboard")
  .addEventListener("click", function () {
    const xmlContent = document.getElementById("modalXmlOutput").value;
    navigator.clipboard
      .writeText(xmlContent)
      .then(() => {
        console.log("XML content copied to clipboard");
        // Optionally, notify the user that the content was successfully copied.
        alert("XML content copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text to clipboard", err);
        // Fallback or notify the user in case of an error
        alert("Failed to copy XML content. Please try again.");
      });
  });

const stateAbbreviations = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function getStateAbbreviation() {
  let stateFullName = document.getElementById("regionCode").value;
  // Split the state name into words, capitalize the first letter of each, and rejoin
  stateFullName = stateFullName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const abbreviation = stateAbbreviations[stateFullName];

  if (abbreviation) {
    console.log(`The abbreviation for ${stateFullName} is ${abbreviation}.`);
    return abbreviation;
  } else {
    console.log("State name not found.");
    return null;
  }
}
