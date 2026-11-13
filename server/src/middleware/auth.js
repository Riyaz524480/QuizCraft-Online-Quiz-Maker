import jwt from 'jsonwebtoken';
export default function auth(req,res,next){
 const token=req.headers.authorization?.replace(/^Bearer /i,'');
 if(!token)return res.status(401).json({message:'Please sign in first.'});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}catch{return res.status(401).json({message:'Your session expired. Sign in again.'});}
}
