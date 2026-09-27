import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[2,"Name must be at least 2 characters"],
        maxlength:[50,"Name maximum length is 50 character"]
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[8,"Password must be at least 8 characters"]
    },
    refreshToken:{
        type:String
    }
  
})

const userModel =mongoose.model("users",userSchema)
export default userModel