require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function addCustomerDirectly() {
  try {
    console.log("Adding customer directly to Supabase...");

    // Minimal customer data that matches our schema requirements
    const customerData = {
      name: "Direct Test Customer",
      email: "direct-test@example.com",
      phone: "555-987-6543",
      funnelStage: "Initial Contact",
      lastContact: new Date().toISOString(),
      leadDate: new Date().toISOString(),
      vehicle: "2023 Honda Accord",
      sourceType: "Direct Test",
      // No salespersonId for now
    };

    console.log("Customer data:", customerData);

    const { data, error } = await supabase
      .from("customers")
      .insert([customerData])
      .select();

    if (error) {
      console.error("Error adding customer directly:", error.message);
      if (error.details) console.error("Error details:", error.details);
      return;
    }

    console.log("Customer added successfully!");
    console.log(data[0]);

    // Now let's check all customers in the table
    console.log("\nListing all customers:");
    const { data: allCustomers, error: listError } = await supabase
      .from("customers")
      .select("*");

    if (listError) {
      console.error("Error listing customers:", listError.message);
      return;
    }

    console.log(`Found ${allCustomers.length} customers:`);
    allCustomers.forEach((customer) => {
      console.log(`- ${customer.name} (${customer.email})`);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

addCustomerDirectly();
