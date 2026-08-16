const mongoose = require("mongoose");

function connectdb() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database connection has been established successfully");
    }).catch((err)=>{
        console.error("Database connection error:", err);
    });
}

module.exports = connectdb;