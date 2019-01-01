const jwt=require('jsonwebtoken');

require('dotenv').config();

module.exports.authoriseUser=function(req,res,next){
    if(req.get('Authorization')==undefined){
        res.json({success:false,message:"Unauthorised. Invalid token"});
    } else{
        let token=req.get('Authorization').split(" ")[1];
        jwt.verify(token,process.env.SECRET,function(err,result){
        if(err){
            res.json({success:false,message:"Unauthorised. Invalid token"});
        } else{
            console.log(result)
            req.body.round=result.round
            req.body.email=result.email;
            req.body.regno=result.regno;
            req.body.id=result.id;
            next();
            }
        })
    }
}