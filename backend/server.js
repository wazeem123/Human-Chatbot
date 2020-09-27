const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const PORT = 4000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));    
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
  }));
app.use('/',routes);

app.listen(PORT,(err)=>{
    if(err){
        console.error('Error in starting server: '+err);
    }else
        console.log('Server is up and running in Port: '+PORT);
})