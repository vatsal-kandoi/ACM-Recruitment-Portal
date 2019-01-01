const question=require('./question-model.js');

//ADDING NEW QUESTION
module.exports.addQuestion=function(question_input,number,type,options,For,correct){
    let ques=new question({
        question:question_input,
        question_type:type,
        number:number,
        options:options,
        For:For,
        correct:correct
    });
    return ques.save();
}

//FINDING ALL QUESTIONS FOR ADMIN
module.exports.findAllQuestions=function(){
    return question.find({}).exec();
}

module.exports.findDepartment=function(dept){
    return question.find({For:dept}).select('_id').exec();
}


//FINDING QUESTIONS BY DEPARTMENT FOR USER
module.exports.find=function(){
    return question.find().select('_id').exec();
}

//UPDATING A QUESTION
module.exports.updateQuestion=function(id,question,score,question_type,options,For,correct){
    return question.findOneAndUpdate({_id:id},{question:question,score:score,question_type:question_type,options:options,for:For,correct:correct}).exec();
}

//REMOVING A QUESTION
module.exports.removeQuestions=function(id){
    return question.findOneAndDelete({_id:id}).exec();
}