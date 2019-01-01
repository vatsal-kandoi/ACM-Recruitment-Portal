const User=require('./user-model.js');


//SIGNUP FUNCTION
module.exports.createUser=function(acmw,gender,name,email,regno,password,phone){
    let user=new User({
        gender:gender,
        name:name,
        email:email,
        phone:phone,
        regno:regno,
        password:password,
        acmw:acmw
    });
    return user.save();
}

//LOGIN FUNCTION
module.exports.findUser=function(email){
    return User.findOne({email:email}).exec();
}

module.exports.find=function(id){
    return User.findOne({_id:id}).exec();
}

module.exports.login=function(regno){
    return User.findOne({regno:regno}).exec();
}

//RESET PASSWORD
module.exports.resetPassword=function(email,password){
    return User.findOneAndUpdate({email:email},{password:password}).exec();
}

//FIND FOR QUIZ OF A DEPT
module.exports.checkQuizofDept=function(id,dept){
    return User.findOne({_id:id,'attempt_ids.For':dept}).exec();
}

//ADD ATTEMPT FOR QUIZ
module.exports.addAttempt=function(id,quiz_id,dept){
    let doc={attempt:quiz_id,For:dept};
    return User.findOneAndUpdate({_id:id},{$push:{attempt_ids:doc}},{new:true}).select('attempt_ids').exec()
}

//FOR ADMIN
module.exports.getAllUsers=function(){
    return User.find({});
}

module.exports.getAllUsersLeft=function(){
    return User.find({attempt_ids:[]}).exec();
}

module.exports.qualify=function(id,num){
    return User.findOneAndUpdate({_id:id},{round_selected:num}).exec()
}
module.exports.getDashboard=function(id){
    return User.findOne({_id:id}).populate({path:'attempt_ids.attempt',select:['status','submit_status','accepted']}).exec();
}
module.exports.getDashboard2=function(regno){
    return User.findOne({regno:regno}).populate({path:'attempt_ids.attempt',select:['status','submit_status','accepted']}).exec();
}
module.exports.findDepartmentAttempted=function(id){
    return User.findOne({_id:id}).select('attempt_ids.For').exec();
}