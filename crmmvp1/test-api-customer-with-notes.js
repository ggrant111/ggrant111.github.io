const fetch = require("node-fetch");
require("dotenv").config();

// Test the API customer creation endpoint with notes field
async function testCustomerCreationWithNotes() {
  const API_URL = process.env.API_URL || "http://localhost:3000";

  // Create a test customer with notes
  const testCustomer = {
    name: "API Notes Test Customer",
    email: "apinotes@example.com",
    phone: "555-888-9999",
    funnelStage: "Initial Contact",
    vehicle: "Test Vehicle API Notes",
    upType: "internet",
    interests: ["Testing", "API", "Notes"],
    notes: "These notes should be converted to saleshistory",
  };

  try {
    console.log("Testing API customer creation with notes...");
    console.log("API URL:", API_URL);
    console.log("Sending data:", testCustomer);

    // Get a user ID for authentication
    console.log("Fetching users to get an ID for testing...");

    let userResponse;
    try {
      userResponse = await fetch(`${API_URL}/api/users`);
      console.log("User response status:", userResponse.status);
    } catch (fetchError) {
      console.error("Error fetching users:", fetchError.message);
      console.log(
        "Is the server running? Check by opening http://localhost:3000 in your browser"
      );
      return;
    }

    let users;
    try {
      const text = await userResponse.text();
      console.log(
        "User response text:",
        text.substring(0, 200) + (text.length > 200 ? "..." : "")
      );
      users = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing user response:", parseError.message);
      return;
    }

    if (!users || users.length === 0) {
      console.error("No users found for authentication");
      return;
    }

    const userId = users[0].id;
    console.log(`Using user ID for authentication: ${userId}`);

    // Create the customer via API
    console.log("Sending POST request to", `${API_URL}/api/customers`);
    let response;
    try {
      response = await fetch(`${API_URL}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId, // Simple auth header for testing
        },
        body: JSON.stringify(testCustomer),
      });
      console.log("Response status:", response.status);
    } catch (fetchError) {
      console.error("Error posting customer:", fetchError.message);
      return;
    }

    let result;
    try {
      const text = await response.text();
      console.log(
        "Response text:",
        text.substring(0, 200) + (text.length > 200 ? "..." : "")
      );
      result = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing response:", parseError.message);
      return;
    }

    if (response.ok) {
      console.log("✅ Customer created successfully:");
      console.log(JSON.stringify(result, null, 2));

      // Check if notes were converted to saleshistory
      if (result.saleshistory && result.saleshistory.length > 0) {
        console.log("✅ Notes were correctly converted to saleshistory:");
        console.log(JSON.stringify(result.saleshistory, null, 2));
      } else {
        console.log("❌ Notes were not converted to saleshistory!");
      }
    } else {
      console.error("❌ API Error:", response.status);
      console.error(result);
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    console.error(error.stack);
  }
}

// Run the test
testCustomerCreationWithNotes()
  .then(() => {
    console.log("Test complete");
  })
  .catch((err) => {
    console.error("Unhandled error in test:", err);
  });
