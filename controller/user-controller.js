const UserTransactions=require('../models/user/user-transactions.js');
const QuestionTransactions=require('../models/question/question-transactions.js');
const AttemptTransactions=require('../models/attempt/attempt-transactions.js');

const jwt=require('jsonwebtoken');
const SHA256=require('crypto-js/sha256');
const randomString=require('randomstring');

require('dotenv').config();

const {sendForgotMail}=require('../utils/emails.js')

function generateAttempt(id,dept){
    return new Promise(function(resolve,reject){
        QuestionTransactions.findDepartment(dept).then(function(result){
            console.log(result);
            return AttemptTransactions.generateAttempt(id,dept,result);
        }).then(function(result){
            console.log(result);
            resolve({success:true,quiz_id:result._id,taker:id});
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error"})
        });
    })
}

module.exports.createUser=function(acmw,gender,name,email,regno,password,phone){
    return new Promise(function(resolve,reject){
        let pass=SHA256(password);
        UserTransactions.createUser(acmw,gender,name,email,regno,pass,phone).then(function(result){
            jwt.sign({id:result._id,timestamp:Date.now(),email:result.email,regno:result.regno,name:result.name},process.env.SECRET,function(err,token){
                    resolve({success:true,name:result.name,email:result.email,regno:result.regno,token:token,attempts:result.attempt_ids});
                });           
        }).catch(function(err){
            console.log("Duplicate")
            console.log(err);
            reject({success:false,message:"You have already registered for the recruitments. Please wait for the first round."});
        });
    });
}

module.exports.loginUser=function(regno,password){
    return new Promise(function(resolve,reject){
        UserTransactions.getDashboard2(regno).then(function(result){
            if(result==null){
                reject({success:false,message:"You have not registered for our recruitments."});    
            } else{
                let pass=SHA256(password).toString();
                if(result.password==pass){
                    if(result.round_selected==2){
                        let round=1;
                        for(i=0;i<result.attempt_ids.length;i++){
                            if(result.attempt_ids[i].For=='technical'){
                                if(result.attempt_ids[i].attempt.accepted==true){
                                    round=2;
                                }
                            }
                        }
                        
                    jwt.sign({id:result._id,round:round,timestamp:Date.now(),email:result.email,regno:result.regno,name:result.name},process.env.SECRET,function(err,token){
                        resolve({success:true,name:result.name,email:result.email,regno:result.regno,token:token,attempts:result.attempt_ids});
                    })
                } else{
                    jwt.sign({id:result._id,round:1,timestamp:Date.now(),email:result.email,regno:result.regno,name:result.name},process.env.SECRET,function(err,token){
                        resolve({success:true,name:result.name,email:result.email,regno:result.regno,token:token,attempts:result.attempt_ids});
                    })
                }
                }else{
                    reject({success:false,message:"Incorrect Combination"});
                }
            }            
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error"});
        })
    });
}


//GET AVAILABLE QUIZES TAKEN WITH STATUS
module.exports.getDashboard=function(user_id){
    return new Promise(function(resolve,reject){
        UserTransactions.getDashboard(user_id).then(function(result){
            if(result==null){
                reject({message:"Not found",success:false})
            } else{
                resolve({success:true,message:"Found",result:result.attempt_ids});
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        });
    })
}


//ADD A NEW QUIZ
module.exports.addQuiz=function(id,dept){
    return new Promise(function(resolve,reject){
        UserTransactions.checkQuizofDept(id,dept).then(function(result){
            if(result==null){
                return generateAttempt(id,dept)                
            //CHECKS IF QUIZ GIVEN FOR DEPARTMENT
            } else{
                resolve({success:false,message:"Quiz already added"});
            }
        }).then(function(result){
            return UserTransactions.addAttempt(id,result.quiz_id,dept)
        }).then(function(result){
            resolve({success:true,message:"Quiz added"})
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error"});
        })
    });
}

module.exports.getGivenQuizzes=function(id){
    return new Promise(function(resolve,reject){
        UserTransactions.findDepartmentAttempted(id).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"})
            } else{
                resolve({message:"Found",success:true,result:result})
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        })
    })
}

module.exports.getQuiz=function(id,dept){
    return new Promise(function(resolve,reject){
        AttemptTransactions.find(id,dept).then(function(result){
            if(result==null){
                reject({success:false,message:"Please try logging in again."})
            }
            else if(result.taker==id){
                return AttemptTransactions.checkSubmitted(id,dept)
            } else{
                reject({success:false,message:"Unauthorised"})
            }
        }).then(function(result){
            if(result==null){
                return AttemptTransactions.getQuiz(id,dept)
            } else{
                reject({success:false,message:"You cannot view the quiz since it has been already submitted"})
            }
        }).then(function(result){
            resolve({success:true,attempt:result});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        });
    });
}

module.exports.saveQuiz=function(id,quiz_id,answers){
    return new Promise(function(resolve,reject){
        AttemptTransactions.findQuiz(quiz_id).then(function(result){
            if(result.taker==id){
                return AttemptTransactions.saveQuiz(quiz_id,answers);
            } else{
                reject({success:false,message:"Unauthorised access"})
            }
        }).then(function(result){
            if(result==null){
                reject({message:"Error",success:false})
            } else{
                resolve({success:true,message:"Quiz saved successfully"})
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        });
    });
}

module.exports.submitQuiz=function(id,quiz_id,answers){
    return new Promise(function(resolve,reject){
        AttemptTransactions.findQuiz(quiz_id).then(function(result){
            if(result.taker==id){
                if(result.For=="design"){
                    let k=0;
                    for(i=0;i<answers.length;i++){
                        if(answers[i].answer!=""){
                            k=1;
                        }
                    }
                    if(k==1){
                        k=null;
                        return AttemptTransactions.submitQuiz(quiz_id,answers);
                    } else{
                        k=null;
                        reject({success:false,message:"Atleast one task is mandatory for design."})
                    }
                }
                 else{
                     return AttemptTransactions.submitQuiz(quiz_id,answers);
                 }
            } else{
                reject({success:false,message:"Unauthorised"})
            }
        }).then(function(result){
            if(result==null){
                reject({message:"Error",success:false})
            } else{
                resolve({success:true,message:"Quiz submitted successfully"})
            }
        }).catch(function(err){
            console.log(err)
            reject({message:"Error",success:false})
        });
    });
}

module.exports.addFile=function(path,name,quiz){
    return new Promise(function(resolve,reject){
        let ques=name.split('-')[0];
        console.log(ques);
        AttemptTransactions.saveQuizLink(quiz,ques,path).then(function(result){
            if(result==null){
                reject({success:false,message:"Error"})
            } else{
                resolve({success:true,message:"File saved"})
            }
        }).catch(function(err){
            console.log(err);
            res.json({success:false,message:"Error"})
        })
    })
}

module.exports.getResult=function(id){
    return new Promise(function(resolve,reject){
        UserTransactions.getDashboard(id).then(function(result){
            let res={success:true,message:"status",technical:0,design:0,management:0}
                for(i=0;i<result.attempt_ids.length;i++){
                    if(result.attempt_ids[i].For=='technical'){
                        if(result.attempt_ids[i].attempt.accepted==true && result.round_selected==2){
                            res.technical=2;
                        } else if(result.attempt_ids[i].attempt.status==2 && result.round_selected==1){
                            res.technical=1;
                        }
                    }
                    else if(result.attempt_ids[i].For=='management'){
                        if(result.attempt_ids[i].attempt.accepted==true && result.round_selected==2){
                            res.management=2;
                        } else if(result.attempt_ids[i].attempt.status==2 && result.round_selected==1){
                            res.management=1;
                        }
                    }
                    else if(result.attempt_ids[i].For=='design'){
                        if(result.attempt_ids[i].attempt.accepted==true && result.round_selected==2){
                            res.design=2;
                        } else if(result.attempt_ids[i].attempt.status==2 && result.round_selected==1){
                            res.design=1;
                        }
                    }
                }
                resolve(res)
                
                
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Invlaid token. Please try logging in again"})
        });
    })
}

module.exports.getLink=function(quiz_id,ques_id){
    return new Promise(function(resolve,reject){
        AttemptTransactions.getLink(quiz_id,ques_id).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"})
            } else{
                for(i=0;i<result.questions.length;i++){
                    if(result.questions[i].question_id==ques_id){
                        resolve({success:true,link:result.questions[i].link})
                    }
                }
            }
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}
//RESET AND FORGOT PASSWORD

module.exports.forgotPassword=function(email){
    return new Promise(function(resolve,reject){
        let newPass=randomString.generate(8);
        let newPassword=SHA256(newPass).toString();

        UserTransactions.resetPassword(email,newPassword).then(function(result){
            if(result==null){
                reject({success:false,message:"You haven't registered for our recruitments."});    
            } else{
                console.log(result);
                sendForgotMail(email,newPass);
                resolve({success:true,message:"An email has been sent to your registered email address. Please check that for the new password."})
            }
            
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.resetPassword=function(email,password,newpassword){
    return new Promise(function(resolve,reject){
        UserTransactions.findUser(email).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"});    
            } else{
                if(result.password==SHA256(password).toString()){
                    newpassword=SHA256(newpassword);
                    UserTransactions.resetPassword(email,newpassword).then(function(result){
                        if(result==null){
                            reject({success:false,message:"Not found"})
                        }else{
                            resolve({success:true,message:"Password updated"});
                        }
                    }).catch(function(err){
                        reject({success:false,message:"Error"})    
                    });
                }
                else{
                    reject({success:false,message:"Enter correct password"});
                }
            }    
        }).catch(function(err){
            reject({success:false,message:"Error"}) 
        });
    });
}

