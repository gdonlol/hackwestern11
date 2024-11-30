import express from "express";
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/generate", async (req, res) => {
    const url = "http://129.100.196.65:6969/generate"
    console.log('sending get req')
    const balls = await axios.get(url, { responseType: "stream" })
    console.log("done")
    console.log(balls)
    res.setHeader("Content-Type", "image/png")
    balls.data.pipe(res)
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
