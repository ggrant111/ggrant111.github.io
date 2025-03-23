require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Mock customer data copied from api/services/customers.js (with id removed)
const mockCustomers = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    funnelStage: "Initial Contact",
    lastContact: "2023-11-10",
    leadDate: "2023-11-10",
    vehicle: "2023 Honda Accord",
    upType: "internet",
    sourceType: "website",
    sourceDetails: "dealership website",
    interests: ["Sedan", "Fuel Efficiency", "Safety Features"],
    salesHistory: [
      {
        date: "2023-11-10",
        action: "Initial Inquiry",
        notes: "Customer inquired about 2023 Honda Accord via website",
      },
      {
        date: "2023-11-11",
        action: "Email",
        notes: "Sent follow-up email with vehicle specifications",
      },
    ],
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    funnelStage: "Test Drive Completed",
    lastContact: "2023-11-09",
    leadDate: "2023-11-05",
    vehicle: "2023 Toyota RAV4",
    upType: "phone",
    sourceType: "referral",
    sourceDetails: "friend recommendation",
    interests: ["SUV", "Cargo Space", "All-wheel Drive"],
    salesHistory: [
      {
        date: "2023-11-05",
        action: "Initial Inquiry",
        notes: "Customer called about SUV options",
      },
      {
        date: "2023-11-07",
        action: "Showroom Visit",
        notes: "Customer visited showroom and viewed multiple SUVs",
      },
      {
        date: "2023-11-09",
        action: "Test Drive",
        notes:
          "Customer test drove RAV4 and expressed interest in financing options",
      },
    ],
  },
  {
    name: "Michael Rodriguez",
    email: "mrodriguez@example.com",
    phone: "(555) 456-7890",
    funnelStage: "Negotiation",
    lastContact: "2023-11-12",
    leadDate: "2023-11-01",
    vehicle: "2023 Ford F-150",
    upType: "showroom",
    sourceType: "drive-by",
    sourceDetails: "walked into dealership",
    interests: ["Truck", "Towing Capacity", "Off-road Capability"],
    salesHistory: [
      {
        date: "2023-11-01",
        action: "Initial Inquiry",
        notes: "Customer inquired about truck options",
      },
      {
        date: "2023-11-03",
        action: "Showroom Visit",
        notes: "Showed customer various truck models",
      },
      {
        date: "2023-11-08",
        action: "Test Drive",
        notes: "Customer test drove F-150 and expressed strong interest",
      },
      {
        date: "2023-11-12",
        action: "Price Discussion",
        notes: "Customer requested pricing details and financing options",
      },
    ],
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "(555) 234-5678",
    funnelStage: "Closed",
    lastContact: "2023-11-15",
    leadDate: "2023-10-25",
    vehicle: "2023 Mazda CX-5",
    upType: "internet",
    sourceType: "google",
    sourceDetails: "google search ads",
    interests: ["SUV", "Technology Features", "Reliability"],
    salesHistory: [
      {
        date: "2023-10-25",
        action: "Initial Inquiry",
        notes: "Customer requested information about compact SUVs",
      },
      {
        date: "2023-10-29",
        action: "Showroom Visit",
        notes: "Showed customer CX-5 and CX-30 models",
      },
      {
        date: "2023-11-03",
        action: "Test Drive",
        notes: "Test drove CX-5, very positive feedback",
      },
      {
        date: "2023-11-10",
        action: "Financing Discussion",
        notes: "Reviewed financing options, customer decided on 60-month loan",
      },
      {
        date: "2023-11-15",
        action: "Purchase",
        notes: "Completed purchase of CX-5 Grand Touring",
      },
    ],
  },
  {
    name: "David Chen",
    email: "dchen@example.com",
    phone: "(555) 876-5432",
    funnelStage: "Initial Contact",
    lastContact: "2023-11-18",
    leadDate: "2023-11-18",
    vehicle: "2023 Tesla Model 3",
    upType: "internet",
    sourceType: "facebook",
    sourceDetails: "facebook ad campaign",
    interests: ["Electric", "Technology", "Performance"],
    salesHistory: [
      {
        date: "2023-11-18",
        action: "Initial Inquiry",
        notes: "Customer showed interest in EV options via email",
      },
    ],
  },
];

async function uploadCustomers() {
  console.log("Starting customer data upload...");
  console.log(`Found ${mockCustomers.length} customers to upload`);

  try {
    // Get a salesperson to assign customers to
    const { data: salespeople, error: salesError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "Salesperson")
      .limit(1);

    if (salesError) {
      console.warn("Error fetching salesperson:", salesError.message);
      console.log("Will upload customers without assigning a salesperson");
    }

    const salespersonId =
      salespeople && salespeople.length > 0 ? salespeople[0].id : null;
    if (salespersonId) {
      console.log(`Found salesperson with ID: ${salespersonId}`);
    }

    // Format customers from mock data for Supabase
    const customersToUpload = mockCustomers.map((customer) => {
      // Convert to the right format for Supabase and use current dates
      const now = new Date();
      const leadDate = new Date(
        now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ); // Random date within last 30 days
      const lastContact = new Date(
        leadDate.getTime() + Math.random() * (now - leadDate)
      );

      return {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        funnelstage: customer.funnelStage,
        lastcontact: lastContact.toISOString(),
        leaddate: leadDate.toISOString(),
        vehicle: customer.vehicle,
        uptype: customer.upType,
        sourcetype: customer.sourceType,
        sourcedetails: customer.sourceDetails,
        interests: customer.interests,
        salespersonid: salespersonId,
        saleshistory: customer.salesHistory,
      };
    });

    console.log(`Preparing to upload ${customersToUpload.length} customers...`);

    // Insert customers into the database in batches of 5
    let successCount = 0;

    // Process in batches to avoid potential size limitations
    const batchSize = 5;
    for (let i = 0; i < customersToUpload.length; i += batchSize) {
      const batch = customersToUpload.slice(i, i + batchSize);

      console.log(`Uploading batch ${Math.floor(i / batchSize) + 1}...`);

      const { data, error } = await supabase
        .from("customers")
        .insert(batch)
        .select();

      if (error) {
        console.error(
          `Error uploading batch ${Math.floor(i / batchSize) + 1}:`,
          error.message
        );
        if (error.details) console.error("Error details:", error.details);
        continue;
      }

      successCount += data.length;
      console.log(
        `Batch ${Math.floor(i / batchSize) + 1} uploaded: ${
          data.length
        } customers`
      );

      data.forEach((customer, index) => {
        console.log(`  - ${customer.name} (ID: ${customer.id})`);
      });
    }

    console.log(
      `Successfully uploaded ${successCount} of ${customersToUpload.length} customers`
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}

// Run the upload function
uploadCustomers()
  .then(() => console.log("Upload process complete"))
  .catch((err) => console.error("Fatal error:", err));
