import express from "express"
import * as dotenv from 'dotenv' 
dotenv.config()

const app = express();
const PORT = process.env.PORT
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}/`)
})

app.get('/', (req,res)=>{
    res.send("Server Home")
})