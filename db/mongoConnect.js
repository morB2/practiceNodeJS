const mongoose = require('mongoose');
const config = require("../config/secret");
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
    // mongoose.set('strictQuery' , false);

  await mongoose.connect( process.config.env.MONGO_CONNECTION_STRING );
console.log("mongo connect started");
  // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}