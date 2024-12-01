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
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get("/api/generate/:styleParam", async (req, res) => {
    const url = `http://129.100.196.65:6969/generate?style=${req.params.styleParam}`
    console.log('sending get req')
    const balls = await axios.get(url)
    console.log('done')
    res.status(200).json({balls: balls.data})
})

app.post("/api/score", async (req, res) => {
    const url = `http://129.100.196.65:6969/score`
    console.log('sending score req')
    const balls = await axios.post(url, req.body)
    console.log('done')
    res.status(200).json({balls: balls.data})
})

app.use("/api/users", userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
