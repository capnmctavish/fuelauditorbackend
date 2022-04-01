// const mongoose = require("mongoose");
// const User = require('../models/user');

// const clientOption = {
//   socketTimeoutMS: 30000,
//   keepAlive: true,
//   useUnifiedTopology: true,
// //   reconnectTries: 30000,
//   poolSize: 50,
//   useNewUrlParser: true,
//   autoIndex: false,
//   useNewUrlParser: true 
// };

// const domainName = User.domainName ;
// const uri = "mongodb://localhost:27017/" + domainName;
// const initClientDbConnection = () => {
//   const db = mongoose.createConnection(uri, clientOption);

//   db.on("error", console.error.bind(console, "MongoDB Connection Error>> : ")).catch(err => console.log(err));
//   db.once("open", function() {
//     console.log("client MongoDB Connection ok!");
//   });
//   require('../models/user.js')
//   return db;
// };

// module.exports = {
//   initClientDbConnection
// };