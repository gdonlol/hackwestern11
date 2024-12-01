import express from "express";
const axios = require('axios');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose')
const userRoute = require('./userRoute') 

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('Database connection succsessful.')
    })
    .catch(() => {
        console.error('Database connection failed.')
    })

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/generate/:typeParam", async (req, res) => {
    const url = `http://129.100.196.65:6969/generate?style=${req.params.typeParam}`
    console.log('sending get req')
    const balls = await axios.get(url, { responseType: 'stream' })
    console.log("done")
    res.setHeader("Content-Type", "image/png")
    balls.data.pipe(res)
});

app.get("/api/lineart/:typeParam", async (req, res) => {
    const url = `http://129.100.196.65:6969/generate?style=${req.params.typeParam}`
    const lineartUrl = `http://129.100.196.65:6969/lineart`
    await axios.get(url)
    const lineartBlob = await axios.get(lineartUrl, { responseType: 'stream'})
    console.log("done")
    res.setHeader("Content-Type", "image/png")
    lineartBlob.data.pipe(res)
});

app.use("/api/users", userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
