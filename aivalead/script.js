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
    const prospectStatus = document.getElementById('prospectStatus').value || defaultValues.prospectStatus;
    const firstName = document.getElementById('firstName').value || defaultValues.firstName;
    const lastName = document.getElementById('lastName').value || defaultValues.lastName;
    const email = document.getElementById('email').value || defaultValues.email;
    const phone = document.getElementById('phone').value || defaultValues.phone;
    const phoneTime = document.getElementById('phoneTime').value || defaultValues.phoneTime;
    const street = document.getElementById('street').value || defaultValues.street;
    const city = document.getElementById('city').value || defaultValues.city;
    const regionCode = document.getElementById('regionCode').value || defaultValues.regionCode;
    const postalCode = document.getElementById('postalCode').value || defaultValues.postalCode;
    const country = document.getElementById('country').value || defaultValues.country;
    const customerID = document.getElementById('customerID').value || defaultValues.customerID;
    const comments = document.getElementById('comments').value || defaultValues.comments;
    const providerID = document.getElementById('providerID').value || defaultValues.providerID;
    const providerName = document.getElementById('providerName').value || defaultValues.providerName;

    // Generating the current timestamp for requestDate
    const requestDate = new Date().toISOString();

    // Constructing the XML string with user input or default values
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <?adf version="1.0"?>
    <adf>
    
  <prospect status="${prospectStatus}">
    <requestdate>${requestDate}</requestdate>
    <vehicle interest="buy" status="used">
      <year>2019</year>
      <make>Nissan</make>
      <model>Kicks</model>
      <vin>3N1CP5BV8LL519113</vin>
      <stock>L519113</stock>
      <trim>S</trim>
      <transmission>Automatic CVT</transmission>
      </vehicle>
    <customer>
      <contact primarycontact="1">
        <name part="first" type="individual">${firstName}</name>
        <name part="last" type="individual">${lastName}</name>
        <email>${email}</email>
        <phone type="phone" time="${phoneTime}">${phone}</phone>
        <address type="home">
          <street line="1">${street}</street>
          <city>${city}</city>
          <regioncode>${regionCode}</regioncode>
          <postalcode>${postalCode}</postalcode>
          <country>${country}</country> 
        </address>
      </contact>
      <id sequence="0">${customerID}</id>
      <comments>${comments}</comments>
    </customer>
    <provider>
      <id sequence="0">${providerID}</id>
      <name part="full" type="business">${providerName}</name>
    </provider>
  </prospect>
</adf>`;

    // Display the XML string in the modal's textarea instead of the form's textarea
    document.getElementById('modalXmlOutput').value = xml;

    // Show the modal
    const modal = document.getElementById('xmlModal');
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
const span = document.getElementsByClassName("close-button")[0];
span.onclick = function() {
    const modal = document.getElementById('xmlModal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById('xmlModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('copyButton').addEventListener('click', function() {
    const xmlContent = document.getElementById('modalXmlOutput').value;
    // Encode the XML content to ensure it's safe to include in a URI
    const encodedXml = encodeURIComponent(xmlContent);
    
    // Construct the mailto link with the encoded XML content
    const mailtoLink = `mailto:excellencemotors@edealertrack.net?subject=New Lead&body=${encodedXml}`;
    
    // Open the default email application with the prepared link
    window.open(mailtoLink, '_blank');
});


