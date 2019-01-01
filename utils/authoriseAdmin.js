const jwt=require('jsonwebtoken');

require('dotenv').config();

module.exports.authoriseAdmin=function(req,res,next){
    token=req.header('Authorization').split(" ")[1];
    jwt.verify(token,process.env.ADMINSECRET,function(err,result){
    if(err){
        res.json({success:false,message:"Unauthorised. Invalid token"});
    } else{
        if(result.access=="all"){
            next();
        } else{
            res.json({success:false,message:"No access"});
        }   
    }
    })
}