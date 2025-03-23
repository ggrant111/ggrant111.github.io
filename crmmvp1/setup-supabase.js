require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { ROLES, PERMISSIONS } = require("./api/models/User");

// Load default users from User model
const { users } = require("./api/models/User");

// Load mock customers data
const customersService = require("./api/services/customers");
const mockCustomers = customersService.mockCustomers || [];

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setupDatabase() {
  try {
    console.log("Setting up Supabase tables...");

    // Check if users table exists and is accessible
    console.log("Testing connection to users table...");
    const { data: usersData, error: usersCheckError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (usersCheckError) {
      console.error(
        "Error connecting to users table:",
        usersCheckError.message
      );
      console.log(
        "\nPlease make sure you've created the necessary tables in Supabase."
      );
      console.log(
        "You can use the supabase-tables.sql script to create the tables."
      );
      return;
    }

    console.log("Connection to users table successful!");

    // Get existing users
    const { data: existingUsers, error: usersFetchError } = await supabase
      .from("users")
      .select("*");

    if (usersFetchError) {
      console.error("Error fetching existing users:", usersFetchError.message);
      return;
    }

    // Create a map of username to Supabase user ID
    const usernameToIdMap = {};
    existingUsers.forEach((user) => {
      usernameToIdMap[user.username] = user.id;
    });

    console.log("Existing users:", usernameToIdMap);

    // Insert default users if they don't exist
    console.log("Checking and inserting default users...");
    for (const user of users) {
      // Check if user already exists by username
      const existingUser = existingUsers.find(
        (u) => u.username === user.username
      );

      if (!existingUser) {
        console.log(`User ${user.username} not found, creating...`);
        // Create new user without specifying ID (let Supabase generate it)
        const { data, error } = await supabase
          .from("users")
          .insert({
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username,
            role: user.role,
          })
          .select();

        if (error) {
          console.error(`Error inserting user ${user.name}:`, error.message);
        } else {
          console.log(
            `User ${user.name} created successfully with ID: ${data[0].id}`
          );
          usernameToIdMap[user.username] = data[0].id;
        }
      } else {
        console.log(
          `User ${user.username} already exists with ID: ${existingUser.id}`
        );
      }
    }

    // Insert mock customers if available
    if (mockCustomers && mockCustomers.length > 0) {
      console.log("Importing mock customers data...");

      for (const customer of mockCustomers) {
        // Convert salesHistory to JSONB if needed
        let customerData = { ...customer };

        if (
          customerData.salesHistory &&
          !Array.isArray(customerData.salesHistory)
        ) {
          customerData.salesHistory = JSON.stringify(customerData.salesHistory);
        }

        // Convert interests to array if needed
        if (customerData.interests && !Array.isArray(customerData.interests)) {
          customerData.interests = customerData.interests
            .split(",")
            .map((i) => i.trim());
        }

        // Handle the salesperson ID mapping
        // If assignedTo is set to a string ID like "1", map it to the actual UUID
        if (customerData.assignedTo) {
          // Find the user who was assigned
          const assignedUser = users.find(
            (u) => u.id === customerData.assignedTo
          );
          if (
            assignedUser &&
            assignedUser.username &&
            usernameToIdMap[assignedUser.username]
          ) {
            customerData.salespersonId = usernameToIdMap[assignedUser.username];
          }
          delete customerData.assignedTo;
        }

        // Remove ID to let Supabase generate one (avoids UUID format issues)
        const customerId = customerData.id;
        delete customerData.id;

        const { data, error } = await supabase
          .from("customers")
          .insert(customerData);

        if (error) {
          console.error(
            `Error importing customer ${customer.name}:`,
            error.message
          );
        } else {
          console.log(`Customer ${customer.name} imported successfully`);
        }
      }
    } else {
      console.log("No mock customers found to import");
    }

    console.log("\nSetup complete!");
    console.log(
      "Your Supabase database has been initialized with default data."
    );
    console.log(
      "You can now use the CRM application with Supabase as the backend."
    );
  } catch (error) {
    console.error("Error setting up database:", error.message);
  }
}

setupDatabase();
