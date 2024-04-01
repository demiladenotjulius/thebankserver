const express = require('express');
const app = express();
const userRouter = require('./Routes/routes')
const cors = require('cors');
const ConnectToDB = require('./Database/database')

require('dotenv').config()

const port = process.env.PORT




app.get('/', (req, res) =>{
    res.json({success: true, message: 'backend working'})
})



const allowedOrigins = ['http://localhost:5173', 'https://bank-client-two.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true 
}));


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(userRouter)
app.use(express.static('public'));


app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})

ConnectToDB()