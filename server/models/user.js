import mongoose from "mongoose";

// timestap used when user is created it adds time and date

const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    fullName:{type:String,required:true},
    password:{type:String,required:true,minlength:6},
    profilePic:{type:String,default:""},
    bio:{type:String},
}, {timestamps:true});

// create user modal
const User = mongoose.model("User",userSchema);

export default User;