const moment = require('moment');
const mongoose = require('../../_DB/db.info');
const UserSchema = mongoose.Schema({
    Name: {
        type:String,
        required:true
    },
    Email: {
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Organization:{
        type:String,
        required:true 
    },
    Phone:{
        type:String,
        required:true
    },
    TrialUser:{
        type:Boolean,
        default:true
    },
    RegisteredOn:{
        type:String,
        default:+new moment() 
    },
    TrialModifiedOn:{
        type:String,
        default:+new moment()     //extend the trial by extending this
    }
});

module.exports = mongoose.model('user',UserSchema);