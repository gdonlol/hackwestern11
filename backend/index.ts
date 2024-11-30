import express from "express";
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/generate", async (req, res) => {
    const url = ""
    const balls = await axios.get(url, { responseType: "stream" })
    res.setHeader("Content-Type", "image/png")
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
