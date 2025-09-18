import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

// instance of express app and http server
// we r using http server cause soket.io supports ttp server
const app = express();
const server = http.createServer(app);

// middleware setup

// e.g limit of images size
app.use(express.json({limit:"4mb"}));

// connect all url to the backend
app.use(cors());

// when we test the api endpoint then we will get below result
app.use("/api/status", (req,res)=>res.send("Server is live"));


// connect to mongodb
await connectDB();

const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT , ()=>console.log("Server is running on port :"+ PORT))

