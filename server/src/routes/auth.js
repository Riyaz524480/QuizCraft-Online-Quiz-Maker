import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router=Router();
const tokenFor=u=>jwt.sign({id:u._id.toString()},process.env.JWT_SECRET,{expiresIn:'7d'});
const publicUser=u=>({id:u._id,name:u.name,email:u.email});
router.post('/register',async(req,res,next)=>{try{
 const {name,email,password}=req.body;
 if(typeof name!=='string'||name.trim().length<2||typeof email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<8)return res.status(400).json({message:'Enter a name, valid email, and password of at least 8 characters.'});
 if(await User.exists({email:email.trim().toLowerCase()}))return res.status(409).json({message:'Email already registered.'});
 const u=await User.create({name:name.trim(),email:email.trim().toLowerCase(),password:await bcrypt.hash(password,12)});
 res.status(201).json({token:tokenFor(u),user:publicUser(u)});
}catch(e){if(e.code===11000)return res.status(409).json({message:'Email already registered.'});next(e)}});
router.post('/login',async(req,res,next)=>{try{
 const {email,password}=req.body;
 const u=await User.findOne({email:String(email||'').trim().toLowerCase()});
 if(!u||typeof password!=='string'||!(await bcrypt.compare(password,u.password)))return res.status(401).json({message:'Incorrect email or password.'});
 res.json({token:tokenFor(u),user:publicUser(u)});
}catch(e){next(e)}});
router.get('/me',auth,async(req,res,next)=>{try{const u=await User.findById(req.user.id);if(!u)return res.status(404).json({message:'User not found.'});res.json(publicUser(u));}catch(e){next(e)}});
export default router;
