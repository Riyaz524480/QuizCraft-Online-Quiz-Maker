// Copyright © 2026 Riyaz Ahmad. All rights reserved.
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
const {MONGO_URI,JWT_SECRET,CLIENT_URL='http://localhost:5173',PORT=5000}=process.env;
if(!MONGO_URI||!JWT_SECRET||JWT_SECRET==='replace_with_a_long_random_secret'){console.error('Set MONGO_URI and a secure JWT_SECRET in server/.env');process.exit(1)}
const app=express();app.use(helmet());app.use(cors({origin:CLIENT_URL.split(',').map(x=>x.trim())}));app.use(express.json({limit:'1mb'}));
app.get('/api/health',(_,res)=>res.json({status:'ok'}));app.use('/api/auth',authRoutes);app.use('/api/quizzes',quizRoutes);
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Unexpected server error.'})});
mongoose.connect(MONGO_URI).then(()=>app.listen(PORT,()=>console.log(`QuizCraft API running on port ${PORT}`))).catch(e=>{console.error('Database connection failed:',e.message);process.exit(1)});
