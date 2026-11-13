import mongoose from 'mongoose';
const question = new mongoose.Schema({ text:{type:String,required:true}, options:{type:[String],required:true}, correctIndex:{type:Number,required:true,min:0,max:3} },{_id:false});
const schema = new mongoose.Schema({ title:{type:String,required:true,trim:true,maxlength:120}, description:{type:String,default:'',maxlength:500}, category:{type:String,default:'General',maxlength:50}, author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, questions:{type:[question],validate:[v=>v.length>0 && v.length<=50,'Provide 1 to 50 questions']} },{timestamps:true});
export default mongoose.model('Quiz',schema);
