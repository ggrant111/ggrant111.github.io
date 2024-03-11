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
    const mailtoLink = `mailto:excellencemotors@eleadtrack.net?subject=New Lead&body=${encodedXml}`;
    
    // Open the default email application with the prepared link
    window.open(mailtoLink, '_blank');
});

document.getElementById('universalMotors').addEventListener('click', function() {
    const xmlContent = document.getElementById('modalXmlOutput').value;
    // Encode the XML content to ensure it's safe to include in a URI
    const encodedXml = encodeURIComponent(xmlContent);
    
    // Construct the mailto link with the encoded XML content
    const mailtoLink = `mailto:excellencegm@eleadtrack.net?subject=New Lead&body=${encodedXml}`;
    
    // Open the default email application with the prepared link
    window.open(mailtoLink, '_blank');
});
// document.getElementById('copyButton').addEventListener('click', async function() {
//     const xmlContent = document.getElementById('modalXmlOutput').value;

//     // Check if the Web Share API is supported
//     if (navigator.canShare && navigator.share) {
//         try {
//             // Use the Web Share API to share the XML content
//             await navigator.share({
//                 title: 'New Lead',
//                 text: xmlContent,
//                 url: '' // You might not need a URL for sharing XML content directly
//             });
//             console.log('Content shared successfully');
//         } catch (error) {
//             console.error('Error sharing content: ', error);
//         }
//     } else {
//         // Fallback for devices that do not support the Web Share API
//         // For instance, you could select the content for the user to copy manually
//         const encodedXml = encodeURIComponent(xmlContent);
//         const mailtoLink = `mailto:excellencemotors@edealertrack.net?subject=New Lead&body=${encodedXml}`;
//         window.open(mailtoLink, '_blank');
//     }
// });



document.getElementById('fetchRandomLead').addEventListener('click', function() {
    fetch('https://randomuser.me/api/?nat=us')
   
    .then(response => response.json())
    
    .then(data => {
        const lead = data.results[0];
        // Populating the form fields with fetched data
        document.getElementById('firstName').value = lead.name.first;
        document.getElementById('lastName').value = lead.name.last;
        document.getElementById('email').value = lead.email;
        document.getElementById('phone').value = lead.phone;
        // Assuming you want to combine the street number and name for the address
        document.getElementById('street').value = `${lead.location.street.number} ${lead.location.street.name}`;
        console.log(lead.location.street.number)
        document.getElementById('city').value = lead.location.city;
        document.getElementById('regionCode').value = lead.location.state;
        document.getElementById('postalCode').value = lead.location.postcode;
        // Additional fields can be populated similarly based on your form's requirements

        // Since the modal and other elements are part of a larger form, you might need to adjust
        // or add specific IDs if fields are named differently or require additional handling.
    })
    .catch(error => console.error('Error fetching random lead:', error));
    
});

document.getElementById('sendParsedLead').addEventListener('click', function() {
    const leadEmail = document.getElementById('leadParsingAddress').value.trim();
    if (!leadEmail) {
        alert('Please enter a lead parsing email address.');
        return;
    }

    const xmlContent = document.getElementById('modalXmlOutput').value;
    const subject = encodeURIComponent('New Lead');
    const body = encodeURIComponent(xmlContent);

    // Constructing the mailto link with user input for the lead parsing address
    const mailtoLink = `mailto:${leadEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink; // Open the default email client with pre-filled details
});

document.getElementById('copyToClipboard').addEventListener('click', function() {
    const xmlContent = document.getElementById('modalXmlOutput').value;
    navigator.clipboard.writeText(xmlContent).then(() => {
        console.log('XML content copied to clipboard');
        // Optionally, notify the user that the content was successfully copied.
        alert('XML content copied to clipboard!');
    }).catch(err => {
        console.error('Error copying text to clipboard', err);
        // Fallback or notify the user in case of an error
        alert('Failed to copy XML content. Please try again.');
    });
});
