const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const evaluatorSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    evaluating:{
        
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attempts',  
        default:null
    },
    evaluated:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attempts',
        }
    ],
    password:{
        type:String,
        required:true
    }
})


module.exports=mongoose.model('Evaluator',evaluatorSchema);