import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from 'jsonwebtoken'

const verifyJWT = asyncHandler(async(req,res,next) =>{
  const token =  req.cookies?.accessToken || req.header("Authurization")?.replace("Bearare ", "")

  if(!token){
    throw new ApiError(401,{},'unauthurized request')
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

 const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")

 if(!user){
    throw new ApiError(401, 'invalid access token')
 }

 req.user = user
 next()
})

export {
    verifyJWT
}