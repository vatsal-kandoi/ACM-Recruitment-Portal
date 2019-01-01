const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const helmet=require('helmet')
const cookieParser=require('cookie-parser');
require('dotenv').config();

const app=express();
const user=require('./routes/user-routes.js');
const admin=require('./routes/admin-routes.js');
const evaluator=require('./routes/checker-routes.js')
const auth=require('./utils/authoriseChecker.js').authoriseChecker;
const fs=require('fs')
const {sendReminder}=require('./utils/emails.js')

mongoose.connect(process.env.PRODDB_URL,function(err){
    if(err){
        console.log("Error connecting to database.");
    } else{        
        app.use(helmet())
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(cookieParser());

        app.get('/',function(req,res){
            res.sendFile(__dirname+'/views/index.html')
        })
        app.get('/dashboard',auth,function(req,res){
            res.sendFile(__dirname+'/views/dashboard.html');
        })
        app.get('/evaluation',auth,function(req,res){
            res.sendFile(__dirname+'/views/evaluation.html')
        })
        app.get('/result',auth,function(req,res){
            res.sendFile(__dirname+'/views/result.html')
        })
        app.get('/eval',auth,function(req,res){
            res.sendFile(__dirname+'/views/eval.html')
        })
        app.use('/api/eval',evaluator);
        app.use('/api/admin',admin);

        //CORS MIDDLEWARE
        app.use(function(req,res,next){
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Access-Control-Allow-Methods','*');
            res.setHeader('Access-Control-Expose-Headers','Authorization, Content-Length');
            res.setHeader('Access-Control-Allow-Headers','Authorization, Origin, Accept,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            next();
        });

        app.use('/api/user',user);       

        app.use("*",function(err,req,res,next){
            console.log(err);
            res.status(500).json({code:500,message:"Error"});
        });
        app.listen(process.env.PORT || 3000);
    }
});
