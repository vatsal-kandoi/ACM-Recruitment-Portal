const jwt=require('jsonwebtoken');

require('dotenv').config();

module.exports.authoriseChecker=function(req,res,next){
    token=req.cookies['Authorization'];
    jwt.verify(token,process.env.ADMINSECRET,function(err,result){
    if(err){
        res.json({success:false,message:"Unauthorised. Invalid token"});
    } else{
        if(result.access=="checker"){
            req.body.id=result.id;
            next();
        } else{
            res.json({success:false,message:"No access"});
        }   
    }
    })
}