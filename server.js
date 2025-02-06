const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to My Test Backend!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
