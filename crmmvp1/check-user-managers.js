require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserManagers() {
  console.log("Checking user manager relationships...");

  try {
    // Get all users
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    console.log(`Found ${users.length} users in the database.`);

    // Check for managerid column
    const hasManagerId = users.length > 0 && "managerid" in users[0];
    console.log(`managerid column exists: ${hasManagerId}`);

    if (hasManagerId) {
      // Find salespeople with managers
      const salespeople = users.filter(
        (user) => user.role === "Salesperson" && user.managerid
      );

      console.log(
        `\nFound ${salespeople.length} salespeople with managers assigned:`
      );

      if (salespeople.length > 0) {
        salespeople.forEach((salesperson) => {
          const manager = users.find((u) => u.id === salesperson.managerid);
          console.log(
            `- ${salesperson.name} (${salesperson.email}) is assigned to ${
              manager ? manager.name : "Unknown manager"
            }`
          );
        });
      } else {
        console.log(
          "No salespeople with managers found. Try creating a salesperson and assigning them to a manager."
        );
      }

      // List all managers
      const managers = users.filter(
        (user) => user.role === "Manager" || user.role === "BDC Manager"
      );

      console.log(`\nFound ${managers.length} managers in the system:`);
      managers.forEach((manager) => {
        console.log(`- ${manager.name} (${manager.email})`);
      });
    } else {
      console.log(
        "\nThe managerid column doesn't appear to exist or is empty for all users."
      );
      console.log(
        "Make sure you've added the column in Supabase and it's named 'managerid'."
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}

// Function to create a test salesperson with a manager
async function createTestSalesperson() {
  // First get a manager to assign
  const { data: managers } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "Manager")
    .limit(1);

  if (!managers || managers.length === 0) {
    console.log("No managers found. Create a manager first.");
    return;
  }

  const managerId = managers[0].id;
  console.log(`Using manager: ${managers[0].name} (${managerId})`);

  // Create a test salesperson
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: "Test Salesperson",
        email: "test.sales@example.com",
        username: "testsales",
        password: "password123", // In a real app, hash this!
        role: "Salesperson",
        managerid: managerId,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating test salesperson:", error.message);
  } else {
    console.log("Test salesperson created:", data[0]);
  }
}

// Run the check function first
checkUserManagers()
  .then(() => {
    console.log("\nNow creating a test salesperson...");
    return createTestSalesperson();
  })
  .then(() => {
    console.log("\nRunning check again to verify the new relationship...");
    return checkUserManagers();
  })
  .then(() => console.log("\nTest complete"))
  .catch((err) => console.error("Fatal error:", err));
