const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    regno:{
        type:String,
        unique:true,
        required:true
    },
    round_selected:{
        type:Number,
        default:1
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    acmw:{
        type:Boolean
    },
    attempt_ids:[
        {
            attempt:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Attempts'
            },
            For:{
                type:String
            }
        }
    ]
});

module.exports=mongoose.model('User',userSchema);