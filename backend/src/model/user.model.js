import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
  },
  userId: {
    type: Number,
    required: true,
  },
  bankAccount: [
    { 
      type: String
     }
    ],
  
  
});


export const User =  mongoose.model("User",userSchema);
