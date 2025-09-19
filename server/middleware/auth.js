// it contains the function which will execute before the execution of controller function
// protecting routes i.e. only if user is authenticated then can access api endpoint
import User from "../models/user.js"
export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.headers.token;
        const user = await User.findById()
    } catch (error) {
        
    }
}