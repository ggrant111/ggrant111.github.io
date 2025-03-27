// XML Generator utility

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  vin: string;
  stock: string;
  trim?: string;
  transmission?: string;
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  vehicle?: VehicleInfo;
  comment: string;
}

export const generateAdfXml = (leadData: LeadData): string => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    vehicle,
    comment,
  } = leadData;

  const requestDate = new Date().toISOString();
  const prospectStatus = 'new';
  const country = 'US';
  const providerID = '0';
  const providerName = 'Lead Generator';

  // Create the XML structure with proper indentation
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?adf version="1.0"?>
<adf>
  <prospect status="${prospectStatus}">
    <requestdate>${requestDate}</requestdate>
    ${vehicle ? `<vehicle interest="buy" status="used">
      <year>${vehicle.year}</year>
      <make>${vehicle.make}</make>
      <model>${vehicle.model}</model>
      <vin>${vehicle.vin}</vin>
      <stock>${vehicle.stock}</stock>
      ${vehicle.trim ? `<trim>${vehicle.trim}</trim>` : ''}
      ${vehicle.transmission ? `<transmission>${vehicle.transmission}</transmission>` : ''}
    </vehicle>` : ''}
    <customer>
      <contact primarycontact="1">
        <name part="first" type="individual">${firstName}</name>
        <name part="last" type="individual">${lastName}</name>
        <email>${email}</email>
        <phone type="home">${phone}</phone>
        <phone type="cellphone">${phone}</phone>
        <phone type="workphone">${phone}</phone>
        <address type="home">
          <street line="1">${address.street}</street>
          <city>${address.city}</city>
          <regioncode>${address.state}</regioncode>
          <postalcode>${address.postalCode}</postalcode>
          <country>${country}</country> 
        </address>
      </contact>
      <comments>${comment}</comments>
    </customer>
    <provider>
      <id sequence="0">${providerID}</id>
      <name part="full" type="business">${providerName}</name>
    </provider>
  </prospect>
</adf>`;

  return xml;
};