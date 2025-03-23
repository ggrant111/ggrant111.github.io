require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkUsers() {
  try {
    console.log("Checking users in Supabase...");

    // Get all users
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    console.log(`Found ${data.length} users in database:`);

    // Display user information
    data.forEach((user) => {
      console.log(`---------------------------------------`);
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password: ${user.password}`);
    });

    console.log("---------------------------------------");
    console.log("Use this information to update your test script");
    console.log(
      "For login, use either email or username with the correct password"
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkUsers();
