const express = require('express')
const router = express.Router()

const adminController=require('../controller/admin-controller.js');
const {authoriseAdmin}=require('../utils/authoriseAdmin.js');

router.post('/login',function(req,res){
    console.log("Admin login")
    if(req.body.name==undefined || req.body.password==undefined){
        console.log(req.body);
        res.json({success:false,message:"Enter all"})
    } else{
        adminController.loginAdmin(req.body.name,req.body.password).then(function(result){
            res.setHeader('Authorization','Bearer '+result.token)
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
})

router.use('/add',authoriseAdmin);
router.post('/add',function(req,res){
    if(req.body.name==undefined || req.body.password==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        adminController.addEvaluator(req.body.name,req.body.password).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/find',authoriseAdmin);
router.get('/find',function(req,res){
    adminController.findAllEvaluators().then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
});

router.use('/findallquestions',authoriseAdmin);
router.get('/findallquestions',function(req,res){
    adminController.getAllQuestions().then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
});

router.use('/removequestion',authoriseAdmin);
router.post('/removequestion',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"No id provided"})
    } else{
        adminController.removeQuestion(req.body.id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
})

router.use('/addquestion',authoriseAdmin);
router.post('/addquestion',function(req,res){
    if(req.body.question_input==undefined || req.body.type==undefined || req.body.For==undefined){
        res.json({success:false,message:"Enter all"});
    } else{
        adminController.addOneQuestion(req.body.question_input,req.body.number,req.body.type,req.body.options,req.body.For,req.body.correct).then(function(result){
            res.json(result);
        }).catch(function(err){
            console.log(err);
            res.json(err);
        });
    }
})

router.use('/addquestions',authoriseAdmin);
router.post('/addquestions',function(req,res){
    if(req.body.questions==undefined || req.body.questions.length==0){
        res.json({success:false,message:"Enter all"});
    } else{
        adminController.addMultipleQuestions(req.body.questions).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        });
    }
})

module.exports=router;