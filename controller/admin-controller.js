const evaluatorTransactions=require('../models/evaluator/evaluator-transactions.js');
const questionTransactions=require('../models/question/question-transactions.js');

const jwt=require('jsonwebtoken');
const SHA256=require('crypto-js/sha256');

require('dotenv').config();

module.exports.loginAdmin=function(name,password){
    return new Promise(function(resolve,reject){
        if(name==process.env.ADMINNAME && password==process.env.ADMINPASS){
            jwt.sign({access:"all",timestamp:Date.now()},process.env.ADMINSECRET,function(err,result){
                if(err){
                    reject({succes:false,message:"Error"})        
                }else{
                    resolve({success:true,token:result})
                }
            });
        } else{
            reject({succes:false,message:"Incorrect combination"})
        }
    })
}

module.exports.findAllEvaluators=function(){
    return new Promise(function(resolve,reject){
        evaluatorTransactions.findAllEvaluators().then(function(result){
            resolve({success:true,evaluators:result})
        }).catch(function(err){
            reject({success:false,message:"Error"})
        })
    })
}

module.exports.addOneQuestion=function(question_input,score,type,options,For,correct){
    return new Promise(function(resolve,reject){
        questionTransactions.addQuestion(question_input,score,type,options,For,correct).then(function(result){
            if(result==null){
                reject({success:false,message:"Error adding question"})    
            }
            else{
                console.log(result);
                resolve({success:true,message:"Question addedd successfully"})}
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error adding question"})
        })
    });
}

module.exports.getAllQuestions=function(){
    return new Promise(function(resolve,reject){
        questionTransactions.findAllQuestions().then(function(result){
            resolve({success:true,message:"Questions found",questions:result})
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error finding question"})
        })
    });
}

module.exports.removeQuestion=function(id){
    return new Promise(function(resolve,reject){
        questionTransactions.removeQuestions(id).then(function(result){
            resolve({success:true,message:"Question removed successfully"})
        }).catch(function(err){
            console.log(err);
            reject({success:false,message:"Error removing question"})
        })
    });
}

module.exports.addMultipleQuestions=function(array){
    return new Promise(function(resolve,reject){
        let len=array.length;
        not_added=[];
        for(i=0;i<len;i++)
        {
            questionTransactions.addQuestion(array[i].question_input,array[i].number,array[i].type,array[i].options,array[i].For,array[i].correct).then(function(result){
                if(result==null){
                    not_added.push(array[i]);    
                } else{
                    console.log("Added");
                    console.log(array[i]);
                }               
            }).catch(function(err){
                not_added.push(array[i]);
            })
        }
        resolve({success:true,not_added:not_added})
    });
}