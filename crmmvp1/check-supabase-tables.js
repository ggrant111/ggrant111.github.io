require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function listTables() {
  try {
    console.log("Listing all tables in the Supabase database...");

    // Query the Postgres system catalogs to list tables
    const { data, error } = await supabase.rpc("list_tables");

    if (error) {
      console.error("Error listing tables:", error.message);
      console.log("\nTrying alternative approach...");

      try {
        // Try direct SQL query (may not work if RLS is restricting access)
        const { data: tables, error: sqlError } = await supabase
          .from("pg_catalog.pg_tables")
          .select("schemaname, tablename")
          .eq("schemaname", "public");

        if (sqlError) {
          console.error("SQL query error:", sqlError.message);
          return;
        }

        console.log("Tables in public schema:");
        tables.forEach((table) => {
          console.log(`- ${table.tablename}`);
        });
      } catch (err) {
        console.error("Alternative approach failed:", err.message);
      }

      return;
    }

    console.log("Tables found:");
    data.forEach((table) => {
      console.log(`- ${table}`);
    });

    // Try to get info about the customers table
    console.log("\nChecking customers table schema...");

    // Define a function to check if a table exists
    async function checkTable(tableName) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select("count")
          .limit(1);

        if (error) {
          console.error(`Error accessing ${tableName} table:`, error.message);
          return false;
        }

        console.log(`Table ${tableName} exists and is accessible.`);
        return true;
      } catch (err) {
        console.error(`Error checking ${tableName} table:`, err.message);
        return false;
      }
    }

    // Check both tables
    await checkTable("customers");
    await checkTable("users");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// First create the function to list tables
async function createListTablesFunction() {
  try {
    const { error } = await supabase.rpc("create_list_tables_function");

    if (error) {
      console.log("Creating list_tables function...");
      const { error: createError } = await supabase.sql(`
        CREATE OR REPLACE FUNCTION list_tables()
        RETURNS TABLE (table_name text)
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY SELECT tablename::text FROM pg_catalog.pg_tables WHERE schemaname = 'public';
        END;
        $$;
      `);

      if (createError) {
        console.error("Error creating function:", createError.message);
      } else {
        console.log("Function created successfully");
      }
    }
  } catch (err) {
    console.log(
      "Error checking/creating function (expected for first run):",
      err.message
    );
  }

  // Now list the tables
  await listTables();
}

createListTablesFunction();
