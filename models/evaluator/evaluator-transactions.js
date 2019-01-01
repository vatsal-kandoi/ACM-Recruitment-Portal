const Evaluator=require('./evaluator-model.js');

//ADDING EVALUATOR
module.exports.addEvaluator=function(name,pass){
    let evaluator=new Evaluator({
        name:name,
        password:pass,
        evaluating:null,
        evaluated:[]
    });
    return evaluator.save(); 
}

//GET ALL EVALUATORS
module.exports.findAllEvaluators=function(){
    return Evaluator.find({}).exec();
}

//LOGIN EVALUATOR
module.exports.findEvaluator=function(name){
    return Evaluator.findOne({name:name}).exec();
}

module.exports.find=function(id){
    return Evaluator.findOne({_id:id}).exec();
}

//ADD NEW EVALUATION
module.exports.addEvaluation=function(id,attempt_id){
    return Evaluator.findOneAndUpdate({_id:id},{evaluating:attempt_id}).exec();
}

//SUBMIT CURRENT EVALUATION
module.exports.submitEvalutation=function(id,quiz_id){
    return Evaluator.findOneAndUpdate({_id:id},{evaluating:null,$push:{evaluated:quiz_id}}).exec();
}

module.exports.findEval=function(id){
    return Evaluator.findOne({_id:id}).populate({path:'evaluating'}).exec();
}

module.exports.removeEval=function(id){
    return Evaluator.findOneAndUpdate({_id:id},{evaluating:null}).exec();
}
module.exports.open=function(id,id2){
    return Evaluator.findOneAndUpdate({_id:id,evaluating:id2}).exec();
}