// Simple script to test direct access to Supabase API
const fetch = require("node-fetch");

const supabaseUrl = "https://yvnemdjdhiihdwbijjfo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bmVtZGpkaGlpaGR3YmlqamZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Njc4NTEsImV4cCI6MjA1ODI0Mzg1MX0.s3r1wUR-aju6trj5NiSs9we36i7UxBhWIOWcof0Rfkc";

async function getSalespeople() {
  try {
    console.log("Attempting to fetch salespeople from Supabase");
    const response = await fetch(
      `${supabaseUrl}/rest/v1/salespeople?select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Successfully fetched salespeople:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to fetch salespeople:", error);
  }
}

// Run the test
getSalespeople();
