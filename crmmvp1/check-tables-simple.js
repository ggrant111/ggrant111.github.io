require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkTables() {
  try {
    console.log("Checking if users table exists...");
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (usersError) {
      console.error("Error accessing users table:", usersError.message);
    } else {
      console.log("Users table exists!");
      if (usersData && usersData.length > 0) {
        console.log(
          "Users table columns:",
          Object.keys(usersData[0]).join(", ")
        );
      } else {
        console.log("Users table exists but is empty.");
      }
    }

    console.log("\nChecking if customers table exists...");
    const { data: customersData, error: customersError } = await supabase
      .from("customers")
      .select("*")
      .limit(1);

    if (customersError) {
      console.error("Error accessing customers table:", customersError.message);
    } else {
      console.log("Customers table exists!");
      if (customersData && customersData.length > 0) {
        console.log(
          "Customers table columns:",
          Object.keys(customersData[0]).join(", ")
        );
      } else {
        console.log("Customers table exists but is empty.");
      }
    }

    // Let's try to insert a simple record into the customers table
    console.log("\nTrying to insert a minimal customer record...");
    const { data: insertData, error: insertError } = await supabase
      .from("customers")
      .insert([
        {
          name: "Test Simple Customer",
          // No other fields to test minimal requirements
        },
      ])
      .select();

    if (insertError) {
      console.error("Insert error:", insertError.message);
      if (insertError.details) {
        console.error("Details:", insertError.details);
      }
    } else {
      console.log("Insert successful!");
      console.log(insertData[0]);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkTables();
