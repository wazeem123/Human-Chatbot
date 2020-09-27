const express = require('express');
const Route = express.Router();

const User_Routing = require('./core/User/Route/user.route');
const DialogFlow_Routing = require('./core/DialogFlow/Route/route.dialogbot.request');

Route.use('/user',User_Routing);
Route.use('/send',DialogFlow_Routing);

module.exports = Route;