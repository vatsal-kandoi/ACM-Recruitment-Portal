const evaluatorTransactions=require('../models/evaluator/evaluator-transactions.js');
const attemptTransactions=require('../models/attempt/attempt-transactions.js');
const userTransactions=require('../models/user/user-transactions.js');


const jwt=require('jsonwebtoken');
const SHA256=require('crypto-js/sha256');

require('dotenv').config();

module.exports.signupEvaluator=function(name,password){
    return new Promise(function(resolve,reject){
        let pass=SHA256(password).toString();
        evaluatorTransactions.addEvaluator(name,pass).then(function(result){
            jwt.sign({timestamp:Date.now(),access:"checker",id:result._id,name:result.name},process.env.ADMINSECRET,function(err,token){
                if(err){
                    reject({success:false,message:"Error"})
                } else{
                    resolve({success:true,info:result,token:token});
                }
            })
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.loginChecker=function(name,password){
    return new Promise(function(resolve,reject){
        var pass=SHA256(password).toString();
        evaluatorTransactions.findEvaluator(name).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"});
            }
            
            else if(result.password==pass){
                jwt.sign({timestamp:Date.now(),access:"checker",id:result._id,name:result.name},process.env.ADMINSECRET,function(err,token){
                    if(err){
                        reject({success:false,message:"Error"})
                    } else{
                        resolve({success:true,info:result,token:token});
                    }
                })
            } else{
                reject({success:false,message:"Incorrect combination"})
            }
        }).catch(function(err){
            reject({success:false,message:"Not found"})
        })
    })
}

module.exports.findAttempts=function(num,dept){
    return new Promise(function(resolve,reject){
        attemptTransactions.getAllAttempts(num,dept).then(function(result){
            let sent=[];
            console.log(result);
            for(i=0;i<result.length;i++){
                sent.push({submit_status:result[i].submit_status,For:result[i].For,taker:result[i].taker,id:result[i]._id})
            }
            resolve({message:"Found",success:true,attempts:sent});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}
module.exports.findNumberofAttempts=function(dept){
    return new Promise(function(resolve,reject){
        attemptTransactions.getNumofAttempts(dept).then(function(result){
            resolve({success:true,message:"Found",number:result.length});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        })
    })
}
module.exports.getAttempt=function(id){
    return new Promise(function(resolve,reject){
        attemptTransactions.getAttempt(id).then(function(result){
            resolve({message:"Found",success:true,attempts:result});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}
module.exports.findDetails=function(name){
    let a=null;
    let b=null;
    return new Promise(function(resolve,reject){
        attemptTransactions.getAttempts(name).then(function(result){
            a=result.length;
            return attemptTransactions.getNumofAttempts(name);
        }).then(function(result){
            b=result.length;
            return attemptTransactions.selected(name);
        }).then(function(result){
            resolve({message:"Found",success:true,result:["Number of attempts:" +a,"Total unchecked: "+b,"Selected:" +result.length]});
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}
module.exports.addEvaluator=function(id,quiz_id){
    return new Promise(function(resolve,reject){
        attemptTransactions.checkIfNoEvalutor(quiz_id).then(function(result){
            if(result==null){
                reject({success:false,message:"Has an evaluator. Select another attempt"})
            } else{
                return attemptTransactions.addEvalutor(id,quiz_id)
            }
        }).then(function(result){
            if(result==null){
                reject({success:false,message:"Error"})
            } else{
                return evaluatorTransactions.addEvaluation(id,quiz_id)
            }
        }).then(function(result){
            if(result==null){
                reject({success:false,message:"Error"})
            } else{
                resolve({success:true,message:"Evaluator added"})
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}

module.exports.findUser=function(id){
    return new Promise(function(resolve,reject){
        userTransactions.find(id).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"})
            } else{
                resolve({success:true,message:"Found",result:result});
            }
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.submitEvaluation=function(id,quiz_id,selected){
    return new Promise(function(resolve,reject){
        attemptTransactions.findQuiz(quiz_id).then(function(result){
            if(result==null){
                reject({success:false,message:"Not found"})
            }
            else if(result.evaluator_id==id && result.status!=2){
                return attemptTransactions.submitEvaluation(quiz_id,selected)
            } else{
                reject({success:false,message:"Unauthorised"})
            }
        }).then(function(result){
            if(result==null){
                reject({success:false,message:"Error"})
            } else{
                console.log(result);
                if(selected=="true" || selected==true){
                    return userTransactions.qualify(result.taker,2)
                } else{
                    return userTransactions.qualify(result.taker,1)
                }
            }
        }).then(function(result){
            if(result==null){
                reject({message:"Error",success:false});    
            } else{
                return evaluatorTransactions.submitEvalutation(id,quiz_id)
            }
        }).then(function(result){
            if(result==null){
                reject({message:"Error",success:false});    
            } else{
                resolve({success:true,message:"Submitted"});
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}

module.exports.getEval=function(id){
    return new Promise(function(resolve,reject){
        evaluatorTransactions.find(id).then(function(result){
            return attemptTransactions.getAttempt(result.evaluating);
        }).then(function(result){resolve({success:true,result:result});}).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.removeEval=function(id){
    return new Promise(function(resolve,reject){
        evaluatorTransactions.removeEval(id).then(function(result){
            resolve({success:true});
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.findNumberofResults=function(dept){
    return new Promise(function(resolve,reject){
        attemptTransactions.getNumofResults(dept).then(function(result){
            resolve({success:true,message:"Found",number:result.length});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false})
        })
    })
}

module.exports.findResult=function(num,dept){
    return new Promise(function(resolve,reject){
        attemptTransactions.getAllResults(num,dept).then(function(result){
            let sent=[];
            console.log(result);
            for(i=0;i<result.length;i++){
                sent.push({submit_status:result[i].submit_status,For:result[i].For,taker:result[i].taker,id:result[i]._id})
            }
            resolve({message:"Found",success:true,attempts:sent});
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}

module.exports.open=function(id,quiz_id){
    return new Promise(function(resolve,reject){
        evaluatorTransactions.addEvaluation(id,quiz_id)
        .then(function(result){
            if(result==null){
                reject({success:false,message:"Error"})
            } else{
                resolve({success:true,message:"Evaluator added"})
            }
        }).catch(function(err){
            console.log(err);
            reject({message:"Error",success:false});
        })
    });
}