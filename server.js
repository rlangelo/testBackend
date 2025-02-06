require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL ✅"))
  .catch(err => console.error("PostgreSQL connection error ❌", err));

// Simple test route
app.get("/", (req, res) => {
  res.send("Hello from Node.js backend with PostgreSQL! 🚀");
});

// Test database query
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ success: true, timestamp: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend is running on port ${port}... 🚀`);
});
