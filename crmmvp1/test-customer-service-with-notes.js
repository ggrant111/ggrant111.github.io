require("dotenv").config();
const { createCustomer } = require("./api/services/customers");

// Test the customer service directly with notes field
async function testCustomerServiceWithNotes() {
  try {
    console.log("Testing direct customer creation with notes...");

    // Create a test customer with notes that should be converted to saleshistory
    const testCustomer = {
      name: "Notes Test Customer",
      email: "notes-test@example.com",
      phone: "555-333-4444",
      funnelStage: "Initial Contact",
      vehicle: "Test Vehicle Notes",
      upType: "internet",
      interests: ["Testing", "Notes"],
      notes: "These notes should be handled properly by skipping the field",
    };

    console.log("Customer data to insert:", testCustomer);

    // Create customer directly via service
    const result = await createCustomer(testCustomer);
    console.log("✅ Customer created successfully:");
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("❌ Error creating customer:", error.message);
    if (error.code) console.error("Error code:", error.code);
    if (error.details) console.error("Error details:", error.details);
    console.error(error.stack);
    throw error;
  }
}

// Run the test
testCustomerServiceWithNotes()
  .then((customer) => {
    console.log("Test complete with customer ID:", customer.id);
  })
  .catch((err) => {
    console.error("Unhandled error in test:", err);
  });
