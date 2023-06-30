require('dotenv').config();

//db
const connectDB = require("./db/connectDB")

//custom middlwares
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");

const express = require("express");

const app = express();
app.use(express.json());


app.get("/", (req, res)=>{
    res.send("Hello")
})

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 4500;
const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port);
        console.log('Server is listening on port', port, '...')
    } catch (error) {
        console.log(error)
    }
}

start()