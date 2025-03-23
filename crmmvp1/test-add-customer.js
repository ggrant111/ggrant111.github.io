const fetch = require("node-fetch");

// Test adding a customer
async function addTestCustomer() {
  try {
    // Get user ID first (we'll use the demo user)
    console.log("Fetching user ID...");
    const loginResponse = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "demo", // Using actual username based on database check
        password: "password",
      }),
    });

    // Print the full response for debugging
    console.log("Login response status:", loginResponse.status);

    const responseText = await loginResponse.text();
    console.log("Login response body:", responseText);

    // Try to parse as JSON if possible
    let user;
    try {
      const responseData = JSON.parse(responseText);
      if (!loginResponse.ok) {
        throw new Error(
          `Login failed: ${responseData.error || "Unknown error"}`
        );
      }
      user = responseData;
    } catch (jsonError) {
      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${responseText || "Unknown error"}`);
      }
      throw jsonError;
    }

    console.log(`Logged in as ${user.name} with ID: ${user.id}`);

    // Now add a test customer
    console.log("Adding test customer...");
    const customerResponse = await fetch(
      "http://localhost:3000/api/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.id,
        },
        body: JSON.stringify({
          name: "Test Customer",
          email: "test@example.com",
          phone: "555-123-4567",
          funnelStage: "Initial Contact",
          vehicle: "2023 Toyota Camry",
          sourceType: "Website",
          sourceDetails: "Contact Form",
          notes: "This is a test customer added via API",
        }),
      }
    );

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      throw new Error(
        `Failed to add customer: ${error.error || "Unknown error"}`
      );
    }

    const customer = await customerResponse.json();
    console.log("Customer added successfully!");
    console.log(customer);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the test
addTestCustomer();
