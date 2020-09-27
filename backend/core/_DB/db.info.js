const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DialogFlowAuthApp', {useUnifiedTopology: true,useNewUrlParser: true});
var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open',()=>{
  console.log("Connected to Database.");
});

module.exports = mongoose;