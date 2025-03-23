require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersSchema() {
  console.log("Checking users table schema...");

  try {
    // First try to get all rows to see all possible columns
    const { data: allUsers, error: allUsersError } = await supabase
      .from("users")
      .select("*");

    if (allUsersError) {
      console.error("Error querying all users:", allUsersError.message);
    } else if (allUsers && allUsers.length > 0) {
      console.log(`Found ${allUsers.length} users in the database.`);

      // Combine all columns from all users to get a complete schema
      const allColumns = new Set();
      allUsers.forEach((user) => {
        Object.keys(user).forEach((column) => allColumns.add(column));
      });

      console.log("\nComplete users table schema (all columns from all rows):");
      Array.from(allColumns)
        .sort()
        .forEach((column) => {
          // Find a user that has this column non-null to determine the type
          const userWithColumn = allUsers.find((user) => user[column] !== null);
          const valueType = userWithColumn
            ? typeof userWithColumn[column]
            : "unknown";
          console.log(`- ${column}: ${valueType}`);
        });

      // Check for role column specifically
      if (allColumns.has("role")) {
        console.log("\nUser roles present in the database:");
        const roles = new Set();
        allUsers.forEach((user) => {
          if (user.role) roles.add(user.role);
        });
        Array.from(roles).forEach((role) => console.log(`- ${role}`));
      } else {
        console.log("\nWARNING: No 'role' column found in users table!");
      }

      // Check for managerid column
      if (allColumns.has("managerid")) {
        console.log("\nSalespersons with assigned managers:");
        allUsers
          .filter((user) => user.role === "Salesperson" && user.managerid)
          .forEach((user) => {
            const manager = allUsers.find((u) => u.id === user.managerid);
            console.log(
              `- ${user.name} assigned to: ${
                manager ? manager.name : "Unknown"
              } (${user.managerid})`
            );
          });
      } else {
        console.log("\nWARNING: No 'managerid' column found in users table!");
      }
    } else {
      console.log("No users found, querying table information_schema instead");

      // If no users, query information schema
      const { data: schemaData, error: schemaError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type")
        .eq("table_name", "users")
        .eq("table_schema", "public");

      if (schemaError) {
        console.error("Error querying schema:", schemaError.message);

        // Try one more approach with a raw SQL query
        const { data: rawData, error: rawError } = await supabase.rpc(
          "get_table_columns",
          { table_name: "users" }
        );

        if (rawError) {
          console.error("Error with RPC:", rawError.message);
          return;
        }

        if (rawData) {
          console.log("Users table columns from custom function:");
          rawData.forEach((col) => {
            console.log(`- ${col.column_name}: ${col.data_type}`);
          });
        }
      } else if (schemaData) {
        console.log("Users table schema from information_schema:");
        schemaData.forEach((col) => {
          console.log(`- ${col.column_name}: ${col.data_type}`);
        });
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}

// Run the function
checkUsersSchema()
  .then(() => console.log("Schema check complete"))
  .catch((err) => console.error("Fatal error:", err));
