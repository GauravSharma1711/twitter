import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = async function(userid,res){
const token = await jwt.sign(
    {
    _id:userid
   },
   process.env.process.env.JWT_SECRET,
   {
    expiresIn:'15d'
   })
   res.cookie("token",token,{
    maxAge:'15*24*60*60*1000',
    httpOnly:true,
    sameSite:"strict"
   })
}

