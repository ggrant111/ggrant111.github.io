require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import routes
const aiRoutes = require("./api/routes/ai");
const customerRoutes = require("./api/routes/customers");
const userRoutes = require("./api/routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);

// Serve frontend pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/lead/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "lead-detail.html"));
});

app.get("/reports", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "reports.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

// New route for customer assignment
app.get("/admin-assignment", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-assignment.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
