// getall users except the logged in user
import Message from "../models/message.js"
import User from "../models/user.js";
import cloudinary  from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js"

export const getUsersForSidebar = async(req,res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

        // count no. of messages not seen
        const unseenmessages = {}
        const promises = filteredUsers.map(async (user)=> {
            // get unseen messages
            const messages = await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length >0){
                unseenmessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenmessages})

    } catch (error) {
        console.log(error.messages);
        res.json({success:false,message:error.message})

    }
}

// get all messages for selected users

export const getMessages=async(req,res)=>{
    try {

        // get selected user id
        const {id:selectUserId} = req.params;
        // get my id
        const myId = req.user._id;


        const messages = await Message.find({
            $or: [
                {
                    senderId:myId , receiverId:selectUserId
                },
                {
                    senderId:selectUserId , receiverId:myId
                },
            ]
        })

        await Message.updateMany({senderId:selectUserId,receiverId:myId},{seen:true})
        res.json({success:true,messages})

    } catch (error) {
        console.log(error.messages);
        res.json({success:false,message:error.message})
    }
}

// function to mark message as seen using message id
export const markMessageAsSeen = async (req,res) =>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id , {seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.messages);
        res.json({success:false,message:error.message})
    }
}

// send message to selected user

export const sendMessage = async (req,res) => {
    try {
        const {text,image}=req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadresponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadresponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,receiverId,text,image:imageUrl
        })

        // Emit the new message to the receivers socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.json({success:true,newMessage});

    } catch (error) {
      console.log(error.messages);
        res.json({success:false,message:error.message})   
    }
}