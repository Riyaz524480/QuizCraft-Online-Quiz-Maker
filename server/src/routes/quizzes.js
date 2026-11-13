import {Router} from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';
import auth from '../middleware/auth.js';
const router=Router();
const safe=q=>({id:q._id,title:q.title,description:q.description,category:q.category,author:q.author?.name||'Unknown',questionCount:q.questions.length,createdAt:q.createdAt});
router.get('/',async(req,res,next)=>{try{const qs=await Quiz.find().sort({createdAt:-1}).limit(100).populate('author','name');res.json(qs.map(safe));}catch(e){next(e)}});
router.post('/',auth,async(req,res,next)=>{try{
 const {title,description='',category='General',questions}=req.body;
 if(typeof title!=='string'||!title.trim()||title.length>120||typeof description!=='string'||description.length>500||typeof category!=='string'||category.length>50||!Array.isArray(questions)||questions.length<1||questions.length>50||questions.some(q=>typeof q.text!=='string'||!q.text.trim()||q.text.length>500||!Array.isArray(q.options)||q.options.length!==4||q.options.some(o=>typeof o!=='string'||!o.trim()||o.length>250)||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3))return res.status(400).json({message:'Provide a title and 1–50 valid questions, each with four options and one correct answer.'});
 const q=await Quiz.create({title:title.trim(),description,category:category||'General',questions,author:req.user.id});
 res.status(201).json({id:q.id});
}catch(e){next(e)}});
router.get('/my/attempts',auth,async(req,res,next)=>{try{const attempts=await Attempt.find({user:req.user.id}).sort({createdAt:-1}).limit(30).populate('quiz','title');res.json(attempts.map(a=>({id:a.id,title:a.quiz?.title||'Deleted quiz',score:a.score,total:a.total,createdAt:a.createdAt})));}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{
 if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid quiz ID.'});
 const q=await Quiz.findById(req.params.id).populate('author','name');if(!q)return res.status(404).json({message:'Quiz not found.'});
 res.json({...safe(q),questions:q.questions.map(x=>({text:x.text,options:x.options}))});
}catch(e){next(e)}});
router.post('/:id/submit',auth,async(req,res,next)=>{try{
 if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid quiz ID.'});
 const q=await Quiz.findById(req.params.id);if(!q)return res.status(404).json({message:'Quiz not found.'});
 const {answers}=req.body;
 if(!Array.isArray(answers)||answers.length!==q.questions.length||answers.some(a=>!Number.isInteger(a)||a<0||a>3))return res.status(400).json({message:'Answer every question before submitting.'});
 const score=q.questions.reduce((s,x,i)=>s+(x.correctIndex===answers[i]?1:0),0);
 await Attempt.create({user:req.user.id,quiz:q.id,answers,score,total:q.questions.length});
 res.json({score,total:q.questions.length,review:q.questions.map((x,i)=>({text:x.text,options:x.options,selectedIndex:answers[i],correctIndex:x.correctIndex}))});
}catch(e){next(e)}});
export default router;
