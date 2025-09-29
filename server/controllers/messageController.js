// getall users except the logged in user
import Message from "../models/message.js"
import User from "../models/user";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

        // count no. of messages not seen
        const unseenmessages = {}
        const promises = filteredUsers.map(async (user)=> {
            
        })

    } catch (error) {
        
    }
}