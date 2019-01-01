const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//status
//0->Not revied
//1->In review
//2->Reviewed

let attemptSchema=new Schema({
    taker:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    questions:[
        {
            question_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Questions',
            },
            answer:{
                type:String,
                default:""
            },
            mcq_answer:{
                type:Number,
                default:0
            }
        }
    ],
    status:{
        type:Number,
        default:0
    },
    submit_status:{
        type:Boolean,
        default:false
    },
    evaluator_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluator',
        default:null
    },
    For:{
        type:String
   },
   accepted:{
       type:Boolean,
       default:false
   }
})

module.exports=mongoose.model('Attempts',attemptSchema);