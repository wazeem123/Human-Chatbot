const express = require('express');
const router = express.Router();
const moment = require('moment');
const jwt = require('jsonwebtoken');

const UserModel = require('../Model/user.model');
const TrialDuration = 24*3600*1000; //24 hrs
const SecretKey = "12345678";

router.get('/all',(req,res)=>{
    UserModel.find().then((userArr)=>{
        if(userArr.length){
            let ModifiedArr =[];
            userArr.forEach((user)=>{
                let userMod = {
                    ID:user._id,
                    Name:user.Name,
                    Email:user.Email,
                    Organization:user.Organization,
                    Phone:user.Phone,
                    TrialUser:user.TrialUser,
                    RegisteredOn:moment(Number(user.RegisteredOn)).format('MM-DD-YYYY hh:mm:ss A'),
                    TrialModifiedOn:moment(Number(user.TrialModifiedOn)).format('MM-DD-YYYY hh:mm:ss A'),
                };
                ModifiedArr.push(userMod);
                if(ModifiedArr.length === userArr.length)
                res.status(200).json({status:200,payload:{message:ModifiedArr}});
            })
        
        }else
            res.status(500).json({status:500,payload:{message:'Users cannt be found. Please register first'}});
    })
});

router.post('/register',(req,res)=>{
    let User = req.body;
    if(User.Name){
        let UserObject = new UserModel(User);
        UserModel.find({Email:UserObject.Email}).then((userArr)=>{
            if(userArr.length){
                res.status(500).json({status:500,payload:{message:'Already registered with the provied email. Contact us for more info.'}});
            }else{
                UserObject.save().then((user)=>{
                    res.status(200).json({status:200,payload:{message:'Registeration done.'}});
                }).catch((err)=>{
                    res.status(500).json({status:500,payload:{message:err}});
                });
            } 
        }).catch((err)=>{
            res.status(500).json({status:500,payload:{message:err}});
        });
    }else
        res.status(500).json({status:500,payload:{message:'Requested User cannot be registered. Invalid data recieved.'}});
});

router.post('/login',(req,res)=>{
    let User = req.body;
    UserModel.find({Email:User.Email,Password:User.Password}).then((userArr)=>{
        if(userArr.length){
            let TrialTimestamp = Number(userArr[0].TrialModifiedOn);
            TrialElapsed = moment().diff(TrialTimestamp);

            if(userArr[0].TrialUser){
                if(TrialElapsed>TrialDuration){       //Default trial is for 24Hrs 23hrs and 59minutes
                    res.status(500).json({status:500,payload:{message:'Trial Period of your account has been expired. Plase contact us for more information.'}});
                }else{
                    let payload = {
                        Name:userArr[0].Name,
                        Email:userArr[0].Email,
                        Organization:userArr[0].Organization,
                        Phone:userArr[0].Phone,
                        TrialUser:userArr[0].TrialUser
                    }
                    let token = jwt.sign(payload, SecretKey, {
                        expiresIn: 3600
                    })
                    res.status(200).cookie('pass', token, { maxAge: 3600000,httpOnly: false }).json(payload);
                }  
            }else
                res.status(200).json({status:200,payload:userArr[0]});
        }else{
            res.status(500).json({status:500,payload:{message:'User not found. If you forgot your password contact us.'}});
        }
    }).catch((err)=>{
        res.status(500).json({status:500,payload:{message:'Error in while Signing In. Error: '+err}});
    })
});

router.post("/heartbeat",(req,res)=>{
    if(req.body.key){
        let data=req.body.key;
        let decoded = jwt.decode(data);
            UserModel.find({Name:decoded.Name,Email:decoded.Email}).then((userArr)=>{
                let TrialTimestamp = Number(userArr[0].TrialModifiedOn);
                TrialElapsed = moment().diff(TrialTimestamp);
                if(userArr[0].TrialUser){
                    if(TrialElapsed>TrialDuration){       //Default trial is for 24Hrs 23hrs and 59minutes
                        res.status(500).json({status:500,Error:'Trial Period of your account has been expired. Plase contact us for more information.'});
                    }else{
                        res.status(200).json({status:true});
                    }  
                }else
                    res.status(200).json({status:true});
            }).catch((err)=>{
                res.status(500).json({status:false,Error:err});
            });
    }else
        res.status(500).json({status:false});
})

router.put('/admin/update/:id',(req,res)=>{                                     //Confidential API end
    let ID = req.params.id;
    let User = req.body;
    if(ID){
        if(User.Name && User.Email && User.Phone && User.Organization && User.Password){
            let UserObject = {
                Name:User.Name,
                Email:User.Email,
                Password:User.Password,
                Organization:User.Organization,
                Phone:User.Phone,
                TrialUser:User.TrialUser,
            };
            UserModel.findByIdAndUpdate(ID,UserObject).then((user)=>{
                res.status(200).json({status:200,payload:{message:user.Name+' has been updated successfully.'}})
            }).catch((err)=>{
                res.status(500).json({status:500,payload:{message:err}})
            })
        }else
        res.status(500).json({status:500,payload:{message:'Error data is insufficient.'}})
    }else
    res.status(500).json({status:500,payload:{message:'Error data is insufficient. ID not found.'}})
});

router.put('/admin/update/renew/:id',(req,res)=>{                               //Confidential API end
    let ID = req.params.id;
            UserModel.findByIdAndUpdate(ID,{TrialModifiedOn:+new moment()}).then((user)=>{
                res.status(200).json({status:200,payload:{message:user.Name+'\'s trial has been extended for 24 hours from now.'}})
            }).catch((err)=>{
                res.status(500).json({status:500,payload:{message:err}})
            })
});

router.delete('/admin/delete/:id',(req,res)=>{                                  //Confidential API end
    let ID = req.params.id;
    UserModel.findByIdAndDelete(ID).then((user)=>{
        res.status(200).json({status:200,payload:{message:user.Name+' has been deleted successfully.'}})
    }).catch((err)=>{
        res.status(500).json({status:500,payload:{message:err}})
    });
});

module.exports = router;