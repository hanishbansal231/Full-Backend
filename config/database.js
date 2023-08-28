const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connection Successfully...");
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
module.exports = connectDB;