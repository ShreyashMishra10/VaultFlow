const mongoose = require('mongoose');

async function connectdb(){

    await mongoose.connect("mongodb+srv://admin:Miamorhancock1@cluster0.pqrcufk.mongodb.net/notes")   
    console.log("Database connected successfully");                                 
}

module.exports = connectdb;