const express = require('express')
const router = express.Router()

const checkerController=require('../controller/evaluator-controller.js');
const {authoriseChecker}=require('../utils/authoriseChecker.js');

router.post('/signup',function(req,res){
    if(req.body.name==undefined || req.body.password==undefined){
        res.json({success:false,message:"Enter all"})
    } else if(req.body.secret!='AcmRec2k18_19'){
        res.json({message:"Invalid registration",success:false});
    } else{
        checkerController.signupEvaluator(req.body.name,req.body.password).then(function(result){
            res.cookie('Authorization',result.token, {httpOnly: true })
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
})

router.post('/login',function(req,res){
    console.log('Evaluator login')
    if(req.body.name==undefined || req.body.password==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        
        checkerController.loginChecker(req.body.name,req.body.password).then(function(result){
            res.cookie('Authorization',result.token, {httpOnly: true })
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/dashboard',authoriseChecker);
router.post('/dashboard',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"Error"})
    } else{
        console.log(req.body)
        checkerController.findNumberofAttempts(req.body.dept).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/attempts',authoriseChecker);
router.post('/attempts',function(req,res){
    console.log(req.body)
    checkerController.findAttempts(req.body.num,req.body.dept).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
});

router.use('/resultdashboard',authoriseChecker);
router.post('/resultdashboard',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"Error"})
    } else{
        console.log(req.body)
        checkerController.findNumberofResults(req.body.dept).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/resultattempts',authoriseChecker);
router.post('/resultattempts',function(req,res){
    console.log(req.body)
    checkerController.findResult(req.body.num,req.body.dept).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
});

router.use('/openevaluation',authoriseChecker);
router.post('/openevaluation',function(req,res){
    if(req.body.id==undefined || req.body.quiz_id==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        checkerController.open(req.body.id,req.body.quiz_id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err)
        })
    }
});

router.use('/takeevaluation',authoriseChecker);
router.post('/takeevaluation',function(req,res){
    if(req.body.id==undefined || req.body.quiz_id==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        checkerController.addEvaluator(req.body.id,req.body.quiz_id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err)
        })
    }
});


router.use('/evaluation',authoriseChecker);
router.get('/evaluation',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        checkerController.getAttempt(req.body.id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err)
        })
    }
});

router.use('/evaluation',authoriseChecker);
router.post('/evaluation',function(req,res){
    if(req.body.id==undefined || req.body.quiz_id==undefined || req.body.selected==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        checkerController.submitEvaluation(req.body.id,req.body.quiz_id,req.body.selected).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err)
        })
    }
});

router.use('/userinfo',authoriseChecker)
router.post('/userinfo',function(req,res){
    if(req.body.user_id==undefined){
        res.json({success:false,message:"Enter user id"})
    } else{
        checkerController.findUser(req.body.user_id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
})

router.use('/details',authoriseChecker);
router.post('/details',function(req,res){
    checkerController.findDetails(req.body.dept).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
})
router.use('/changeevaluation',authoriseChecker);
router.post('/changeevalutation',function(req,res){
    checkerController.removeEval(req.body.id).then(function(result){
        res.json(result)
    }).catch(function(err){
        res.json(err);
    })
})
router.use('/resultevaluation',authoriseChecker);
router.get('/resultevaluation',function(req,res){
    checkerController.getEval(req.body.id).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
})

router.use('/logout',authoriseChecker)
router.post('/logout',function(req,res){
    res.clearCookie("Authorization");
    res.json({success:true,message:"Logged out"})
})

module.exports=router;