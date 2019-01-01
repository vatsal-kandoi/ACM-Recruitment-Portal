const express = require('express')
const router = express.Router()

const UserController=require('../controller/user-controller.js');
const {authoriseUser}=require('../utils/authoriseUser.js');
const request=require('request');

//CHECK VALIDITY
const regNoRegex=new RegExp('^1[78]{1}[A-Z]{3}[0-9]{4}$');
const regNoRegex2=new RegExp('^1[8]{1}[A-Z]{3}[0-9]{4}$');
const phoneNoRegex=new RegExp('^[1-9]{1}[0-9]{9}$');
const validator=require('email-validator')

const {sendMail}=require('../utils/emails.js')
const {upload}=require('../utils/upload.js')
require('dotenv').config();

function checkUser(req,res,next){
    if(req.body.round==2){
        next();
    } else{
        res.json({success:false,message:'You have not been selected for the next round.'})
    }
}
//RECAPTCHA verification
router.use('/signup',function(req,res,next){
    request.post('https://www.google.com/recaptcha/api/siteverify?secret='+process.env.RECAPTCHA+'&response='+req.body.recaptcha+'&remoteip=' + req.connection.remoteAddress, function(err,httpResponse,body){
        if(err){
            res.json({success:false,message:"Error verifying reCAPTCHA"});
        } else{
            body = JSON.parse(body);
            console.log(body);
            if(body.success == undefined || body.success==false) {
                res.json({success:false,message: "Failed captcha verification"});
            } else{
                next();
            }
        }
    })
})
router.use('/signup',function(req,res,next){
    res.json({success:false,message:"Resistrations are over ans selections are underway."})
})
router.post('/signup',function(req,res){
    console.log('Signup Request')
    if(req.body.acmw==undefined || req.body.gender==undefined || req.body.name==undefined || req.body.email==undefined || req.body.regno==undefined || req.body.password==undefined || req.body.phone==undefined){
        res.json({success:false,message:"Incomplete body"})
    }else if(!validator.validate(req.body.email)){
        res.json({success:false,message:"Please enter valid email address."});
    } else if(!regNoRegex.test(req.body.regno)){
        res.json({success:false,message:"Please enter valid VIT registration number."})
    } else if(!regNoRegex2.test(req.body.regno)){
        res.json({success:false,message:"Sorry. Recruitments exists only for first years."})
    } else if(!phoneNoRegex.test(req.body.phone)){
        res.json({success:false,message:"Please enter valid phone number."})
    }
    else{
        UserController.createUser(req.body.acmw,req.body.gender,req.body.name,req.body.email,req.body.regno,req.body.password,req.body.phone).then(function(result){
            console.log(result);
            res.setHeader('Authorization','Bearer '+result.token);
            res.json(result);
            // sendMail(req.body.email,req.body.name);
        }).catch(function(err){
            console.log(err);
            res.json(err);
        });
    }
});

router.post('/login',function(req,res){
    console.log('Login request')
    if(req.body.regno==undefined || req.body.password==undefined){
        res.json({success:false,message:"Incomplete body"})
    } else if(!regNoRegex2.test(req.body.regno)){
        res.json({success:false,message:"Please enter valid VIT registration number."})    
    }else{
        UserController.loginUser(req.body.regno,req.body.password).then(function(result){
            res.setHeader('Authorization','Bearer '+result.token);
            res.json(result);
        }).catch(function(err){
            res.json(err);
        });
    }
});

router.post('/forgotpassword',function(req,res){
    if(req.body.email==undefined){
        res.json({success:false,message:"Incomplete body"})
    }else{
        UserController.forgotPassword(req.body.email).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        });
    }
});

router.use('/resetpassword',authoriseUser);
router.post('/resetpassword',function(req,res){
    if(req.body.email==undefined || req.body.password==undefined || req.body.newpassword==undefined){
        res.json({success:false,message:"Incomplete body"})
    }else{
        UserController.resetPassword(req.body.email,req.body.password,req.body.newpassword).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/quiz',authoriseUser);
router.use('/quiz',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/quiz',checkUser);
router.get('/quiz',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"Enter all"})
    } else{
        UserController.getGivenQuizzes(req.body.id).then(function(result){
            res.json(result)
        }).catch(function(err){
            res.json(err);
        })
    }
})

router.use('/quiz',authoriseUser);
router.use('/quiz',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/quiz',checkUser);
router.post('/quiz',function(req,res){
    if(req.body.dept==undefined || req.body.id==undefined){
        res.json({success:false,message:"Incomplete body"});
    } else{
        UserController.addQuiz(req.body.id,req.body.dept).then(function(result){
            return UserController.getQuiz(req.body.id,req.body.dept)
        }).then(function(result){
            console.log(result);
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/getquiz',authoriseUser);
router.use('/getquiz',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/getquiz',checkUser);
router.post('/getquiz',function(req,res){
    if(req.body.dept==undefined || req.body.id==undefined){
        res.json({success:false,message:"Incomplete body"});
    } else{
        UserController.getQuiz(req.body.id,req.body.dept).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});


router.use('/addfile',authoriseUser);
router.post('/addfile',upload.any(),function(req,res){
    UserController.addFile(req.files[0].path,req.files[0].filename,req.query.quiz).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    })
})

// router.use('/getfile',authoriseUser);
router.get('/getfile',function(req,res){
    UserController.getLink(req.query.quiz_id,req.query.ques_id).then(function(result){
        res.download(result.link);
    }).catch(function(err){
        res.json(err);
    })
})

router.use('/savequiz',authoriseUser);
router.use('/savequiz',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/savequiz',checkUser);
router.post('/savequiz',function(req,res){
    console.log(req.body);
    if(req.body.quiz_id==undefined || req.body.answers==undefined || req.body.id==undefined){
        res.json({success:false,message:"Incomplete body"});
    } else{
        UserController.saveQuiz(req.body.id,req.body.quiz_id,req.body.answers).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/attempts',authoriseUser);
router.use('/attempts',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/attempts',checkUser);
router.get('/attempts',function(req,res){
    if(req.body.id==undefined){
        res.json({success:false,message:"Unauthorised"});
    } else{
        UserController.getDashboard(req.body.id).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
})


router.use('/submitquiz',authoriseUser);
router.use('/submitquiz',function(req,res,next){
    res.json({success:false,message:"Sorry, submissions have been closed"})
})
router.use('/submitquiz',checkUser);
router.post('/submitquiz',function(req,res){
    if(req.body.quiz_id==undefined || req.body.id==undefined || req.body.answers==undefined){
        res.json({success:false,message:"Incomplete body"});
    } else{
        UserController.submitQuiz(req.body.id,req.body.quiz_id,req.body.answers).then(function(result){
            res.json(result);
        }).catch(function(err){
            res.json(err);
        })
    }
});

router.use('/result',authoriseUser);
router.get('/result',function(req,res){
    UserController.getResult(req.body.id).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(result);
    })
})

module.exports=router;