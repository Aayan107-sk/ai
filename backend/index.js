import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.routes.js";


const app = express();
const PORT=process.env.PORT || 5000;

// ✅ CORS configuration - IMPORTANT
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL // Production frontend URL
  ],
  credentials: true, // ⭐ Ye zaroori hai cookies ke liye
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(PORT,()=>{
  connectDb();
  console.log(`server is runing ${PORT}`);
})