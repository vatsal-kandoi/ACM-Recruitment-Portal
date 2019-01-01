const Attempt=require('./attempt-model.js');
var mongoose = require('mongoose');

module.exports.generateAttempt=function(id,dept,questions){
    let pu=[]
    for(i=0;i<questions.length;i++){
        let x={};
        x.score_given=0;
        x.answer="";
        x.mcq_answer=0;
        x.comments="";
        x.question_id=mongoose.Types.ObjectId(questions[i]._id);
        pu.push(x);
    }
    let attempt=new Attempt({
        taker:id,
        For:dept,
        questions:pu
    });
    return attempt.save();
}

module.exports.checkSubmitted=function(id,dept){
    return Attempt.findOne({taker:id,For:dept,submit_status:true}).exec();
}

module.exports.find=function(id,dept){
    return Attempt.findOne({taker:id,For:dept}).exec();
}
module.exports.findQuiz=function(quiz){
    return Attempt.findOne({_id:quiz}).exec();
}
module.exports.getQuiz=function(id,dept){
    return Attempt.findOne({taker:id,For:dept}).populate({path:'questions.question_id',select:["question","question_type","options","_id","number"]}).exec();
}

module.exports.submitQuiz=function(quiz_id,questions){
    return Attempt.findOneAndUpdate({_id:quiz_id},{questions:questions,submit_status:true}).exec();
}

module.exports.saveQuiz=function(quiz_id,answers){
    return Attempt.findOneAndUpdate({_id:quiz_id,},{questions:answers}).exec();     
}
module.exports.saveQuizLink=function(quiz_id,question,answer){
    return Attempt.findOneAndUpdate({_id:quiz_id,'questions.question_id':question},{'questions.$.link':answer}).exec();     
}

module.exports.getLink=function(quiz,ques){
    return Attempt.findOne({_id:quiz,'questions.question_id':ques}).exec();
}

module.exports.addEvalutor=function(eval_id,quiz_id){
    return Attempt.findOneAndUpdate({_id:quiz_id},{evaluator_id:eval_id,status:1}).exec();
}

module.exports.checkIfNoEvalutor=function(quiz_id){
    return Attempt.findOne({_id:quiz_id,evaluator_id:null,status:0}).exec();
}

module.exports.submitEvaluation=function(quiz_id,selected){
    return Attempt.findOneAndUpdate({_id:quiz_id},{accepted:selected,status:2}).exec();
}

module.exports.getAttempt=function(id){
    return Attempt.findOne({evaluator_id:id,status:1}).populate({path:'questions.question_id'});
}

module.exports.getAttempt=function(id){
    return Attempt.findOne({_id:id}).populate({path:'questions.question_id'});
}

module.exports.getAllAttempts=function(num,dept){
    return Attempt.find({evaluator_id:null,status:0,For:dept}).populate('taker').skip(10*(num-1)).limit(10).exec();
}
module.exports.getNumofAttempts=function(dept){
    return Attempt.find({evaluator_id:null,status:0,For:dept}).exec();
}
module.exports.getAll=function(){
    return Attempt.find().exec();
}
module.exports.getAttempts=function(name){
    return Attempt.find({For:name}).populate('taker').exec();
}
module.exports.selected=function(name){
    return Attempt.find({taker:name},{accepted:true}).exec();
}
module.exports.findSelected=function(name){
    return Attempt.find({For:name,accepted:true}).populate('taker').exec();
}
module.exports.getNumofResults=function(dept){
    return Attempt.find({For:dept,accepted:true}).populate('taker').exec();
}
module.exports.getAllResults=function(num,dept){
    return Attempt.find({accepted:true,For:dept}).populate('taker').skip(10*(num-1)).limit(10).exec();
}