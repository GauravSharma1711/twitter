
import mongoose from 'mongoose'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength : 6,
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
profileImg:{
    type:String,
    dfault:"",
},
coverImg:{
    type:String,
    dfault:"",
},
bio:{
    type:String,
    dfault:"",
},
link:{
    type:String,
    dfault:"",
},
likedPosts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]
    }
],
isEmailVerified:{
    type:Boolean,
    required:true
},
forgotPasswordToken:{
    type:String,
   
},
forgotPasswordExpiry:{
    type:Date,
   
},
refreshToken:{
    type:String,
},
emailVerificationToken:{
    type:String
},
emailVerificationExpiry:{
    type:Date
}

},{timestamps:true})


userSchema.pre("save",async(next)=>{
if(!this.isModified(password))return next();

await bcrypt.hash(password,10);
})


userSchema.methods.generateAccessToken = async function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        password:this.password
    },
    process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
}
)}



userSchema.methods.generateRefreshToken = async function(){
    jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
)}







userSchema.methods.generateTemperoryToken = function(){
    const unhashedToken  = crypto.randomBytes(20).toString("hex");

 const hashedToken =    crypto.createHash("sha256")
    .update(unhashedToken)
    .digest("hex")

    const tokenExpiry = Date.now()+(20*60*1000)

    return {hashedToken , unhashedToken , tokenExpiry}
    
}

export default User = mongoose.model("user",userSchema);