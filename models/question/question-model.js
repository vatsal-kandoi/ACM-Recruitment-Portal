const mongoose=require('mongoose');
const Schema=mongoose.Schema;
//Question type
//0->Objective
//1->Subjective
//2->Upload
//3-> Star based

//Question order

let questionSchema=new Schema({
    question:{
        type:String,
    },
    question_type:{
        type:Number
    },
    number:{
        type:Number,
    },
    options:[{
        number:{
            type:Number
        },
        content:{
            type:String
        }
    }],
    For:{
        type:String
    },
    correct:[{
        number:{
            type:Number
        }
    }]
});

module.exports=mongoose.model('Questions',questionSchema);