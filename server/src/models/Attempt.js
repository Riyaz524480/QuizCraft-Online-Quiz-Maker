import mongoose from 'mongoose';
const schema = new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},quiz:{type:mongoose.Schema.Types.ObjectId,ref:'Quiz',required:true},answers:{type:[Number],required:true},score:{type:Number,required:true},total:{type:Number,required:true}},{timestamps:true});
export default mongoose.model('Attempt',schema);
