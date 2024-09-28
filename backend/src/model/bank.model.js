import mongoose, { Schema } from "mongoose";

  


  const bankSchema = new Schema({
    bankName:{
        type:String,
        required:true
    },
    branch: {
    type:String,
    required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    bank_code:{
        type:String,
        required:true
    },
    ifsc:{
        type:String,
        required:true,
        lowercase:false,
        unique:true
    },
    weather:
       {
        _id:false,
        temp:{
            type:Number,
            required:true
        },
        humidity:{
            type:Number,
            required:true
        }
       }
   
  })

 export  const  Bank=  mongoose.model("Bank",bankSchema);