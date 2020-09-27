const express = require('express');
const dialogflow = require('../../../dialogflow/dialogflow');
const data= require('../../../dialogflow/cred/config');
const dialogflowCustom = require('../../../dialogflow/dialogflowCustomised');
const router = express.Router();

const sessionData="98a007921c9ddc74ab80347db1eee2eb";

router.post('/custom',(req,res)=>{
    let agentInfo = req.body.agent;
    let inst = new dialogflowCustom(agentInfo);
    let msg = req.body.message;
    
    if(msg){
        inst.sendTextMessageToDialogFlow(msg,sessionData).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            res.status(500).json({status:500,message:err});
        });
    }else{
        res.status(500).json({status:500,message:'Message is null'});
    }
});

router.post('/demo',(req,res)=>{
    let inst = new dialogflow(data.project_id);
    let msg = req.body.message;
    
    if(msg){
        inst.sendTextMessageToDialogFlow(msg,sessionData).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            res.status(500).json({status:500,message:err});
        });
    }else{
        res.status(500).json({status:500,message:'Message is null'});
    }

});

module.exports = router;