import express from "express";
import "dotenv/config";
import cors from "cors";
import http, { Server } from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// instance of express app and http server
// we r using http server cause soket.io supports ttp server
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// store online users
export const userSocketMap = {}; //{userId:socketId}

// socket.io connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId) userSocketMap[userId] = socket.id;

    // emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("User disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

// middleware setup

// e.g limit of images size
app.use(express.json({limit:"4mb"}));

// connect all url to the backend
app.use(cors());

// when we test the api endpoint then we will get below result
app.use("/api/status", (req,res)=>res.send("Server is live"));
// routes setup
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

// connect to mongodb
await connectDB();

const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT , ()=>console.log("Server is running on port :"+ PORT))

