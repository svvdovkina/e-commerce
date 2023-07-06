require('dotenv').config();
require('express-async-errors');

//db
const connectDB = require("./db/connectDB")

//custom middlwares
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const {authenticateUser} = require("./middleware/authentication");

// http logger
const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const express = require("express");

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res)=>{
    res.send("Hello")
})


app.get("/api/v1", (req, res)=>{
    res.json(req.signedCookies)
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);


app.use(notFound);
app.use(errorHandler);

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