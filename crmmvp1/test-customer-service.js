require("dotenv").config();
const { createCustomer } = require("./api/services/customers");

// Test the customer service directly
async function testCustomerService() {
  try {
    console.log("Testing direct customer creation through service...");

    // Create a test customer
    const testCustomer = {
      name: "Service Test Customer",
      email: "servicetest@example.com",
      phone: "555-987-6543",
      funnelStage: "Initial Contact",
      vehicle: "Test Vehicle",
      upType: "internet",
      interests: ["Testing", "Service"],
    };

    console.log("Customer data to insert:", testCustomer);

    // Create customer directly via service
    const result = await createCustomer(testCustomer);
    console.log("✅ Customer created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error creating customer:", error.message);
    if (error.code) console.error("Error code:", error.code);
    if (error.details) console.error("Error details:", error.details);
    console.error(error.stack);
  }
}

// Run the test
testCustomerService()
  .then(() => {
    console.log("Test complete");
  })
  .catch((err) => {
    console.error("Unhandled error in test:", err);
  });
