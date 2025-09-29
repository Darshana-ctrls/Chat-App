import mongoose from "mongoose";

// timestap used when user is created it adds time and date

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text:{type:string,},
    image:{type:string,},
    seen:{type:Boolean,default:false}

}, { timestamps: true });

// create user modal
const Message = mongoose.model("Message", messageSchema);

export default Message;