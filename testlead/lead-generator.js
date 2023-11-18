document.getElementById('create-lead').addEventListener('click', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const lead = getRandomLead(data);
            const adfXml = generateADF(lead);
            const leadOutput = document.getElementById('lead-output');
            leadOutput.textContent = adfXml;
            // Show the "Copy & Email" button
            document.getElementById('copy-to-clipboard').style.display = 'inline';
        })
        .catch(error => console.error('Error loading JSON data:', error));
});

document.getElementById('copy-to-clipboard').addEventListener('click', function() {
    const leadOutput = document.getElementById('lead-output').textContent;
    // Copy to clipboard and then open the default mail app
    copyToClipboard(leadOutput).then(function() {
        console.log('Copying to clipboard was successful!');
        // openDefaultMailApp(leadOutput);
        showAlert();
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

function openDefaultMailApp(text) {
    const subject = encodeURIComponent('Lead Parsing Test');
    const body = encodeURIComponent(text);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

function showAlert() {
    const message = "Code copied to clipboard. Please open a new email window and paste it in the body of the email.";
    alert(message);
}

function getRandomLead(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function generateADF(lead) {
    // Construct the ADF/XML using template literals and the data from the lead object
    return `<?xml version="1.0" encoding="UTF-8"?>
<?adf version="1.0"?>
<adf>
    <prospect>
        <id source="EXAMPLE">${lead.id}</id>
        <requestdate>${new Date().toISOString()}</requestdate>
        <vehicle interest="buy" status="used">
            <id source="2222">${lead.vehicleId}</id>
            <year>${lead.vehicleYear}</year>
            <make>${lead.vehicleMake}</make>
            <model>${lead.vehicleModel}</model>
            <trim>${lead.vehicleTrim}</trim>
        </vehicle>
        <customer>
            <contact>
                <name part="first">${lead.firstName}</name>
                <name part="last">${lead.lastName}</name>
                <email>${lead.email}</email>
                <phone type="voice" time="evening">${lead.phone}</phone>
                <phone type="voice" time="day">${lead.phone}</phone>
                <phone type="cellphone">${lead.phone}</phone>
                <address>
                    <street line="1">${lead.street}</street>
                    <city>${lead.city}</city>
                    <regioncode>${lead.regionCode}</regioncode>
                    <postalcode>${lead.postalCode}</postalcode>
                </address>
            </contact>
            <comments>${lead.comments}</comments>
        </customer>
        <vendor>
            <vendorname>${lead.vendorName}</vendorname>
            <id source="*third party id*">${lead.vendorId}</id>
            <contact>
                <name part="full" type="individual">${lead.vendorContactName}</name>
                <email>${lead.vendorEmail}</email>
                <phone type="voice">${lead.vendorPhone}</phone>
                <address>
                    <street line="1">${lead.vendorStreet}</street>
                    <city>${lead.vendorCity}</city>
                    <regioncode>${lead.vendorRegionCode}</regioncode>
                    <postalcode>${lead.vendorPostalCode}</postalcode>
                </address>
            </contact>
        </vendor>
        <provider>
            <name part="full">${lead.providerName}</name>
            <service>${lead.providerService}</service>
        </provider>
    </prospect>
</adf>`;
}

// Additional utility function to create a random email based on first and last name
// You can call this function inside generateADF if you need a random email
function generateRandomEmail(firstName, lastName) {
    const domain = "@example.com";
    return `${firstName}.${lastName}`.toLowerCase() + domain;
}
