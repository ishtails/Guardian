import express from "express"
import * as dotenv from 'dotenv' 
dotenv.config()
import cors from "cors"
import mongoose from "mongoose"

const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONG_URI);

app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}/`)
})

app.get('/', (req,res)=>{
    res.send("Server Home")
})