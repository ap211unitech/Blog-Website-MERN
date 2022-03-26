// Environmental variables
require("dotenv").config();

const { dbConnect } = require("./config/connect");
dbConnect();

const express = require("express");
const app = express();
const cors = require("cors");

const errHandler = require('./middleware/errHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/category'));
app.use('/', require('./routes/blog'));
app.use('/admin', require('./routes/admin'));

app.use(errHandler)

// Server Runner
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})