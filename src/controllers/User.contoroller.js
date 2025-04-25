import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.utils.js"

const userRegister = asyncHandler(async (req, res) => {
try {
    const { userName, email, password, fullName} = req.body;
    // check validation
    if (
      [userName, email, password, fullName].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required!");
    }
  
    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
  
    if (existedUser) {
      throw new ApiError(409, "username or email already exist");
    }
  
    const avatarLocalPath = await req.files?.avatar[0]?.path;
    let coverImgLocalPath;
    if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
      coverImgLocalPath = req.files?.coverImg[0].path
    }
  
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required!");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg = await uploadOnCloudinary(coverImgLocalPath)
  
    if(!avatar){
      throw new ApiError(409, "Avatar file is required!")
    }
  
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImg: coverImg?.url || "",
      email,
      password,
      userName: userName.toLowerCase()
    })
  
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
    if(!createdUser){
      throw new ApiError(500, "something went wrong while registring user")
    }
    return res.status(201).json(new ApiResponse(200, createdUser, "user register successfully"))
} catch (error) {
  console.log(error)
}
});

const generateAccessAndRefreshToken = async(userId) =>{
try {
  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({validateBeforeSave: false})

  return {accessToken, refreshToken}
} catch (error) {
  throw new ApiError(500, {},'something went wrong while generating refresh and access tokens')
}
}

const userLogin = asyncHandler(async(req,res) =>{
  // req.body -> data
  // check user or email
  // find user 
  // check password
  // generate Access and refresh Token
  // send cokies

  const {userName, email, password} = req.body
  console.log(userName, email, password)

  if(!(userName || email)){
    throw new ApiError(401,{},'username or email is required!')
  }

  const user = await User.findOne({
    $or: [{userName}, {email}]
  })

  if(!user){
    throw new ApiError(404, 'user not found!')
  }

  const isPasswordValid = user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(404, 'invalid password!')
  }

const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const option = {
  httpOnly: true,
  secure: true
}

res.status(200)
.cookie("accessToken", accessToken, option)
.cookie("refreshToken", refreshToken, option)
.json(
  new ApiResponse(
    200,
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "user logging successfully!"
  )
)
})

const userLogOut = asyncHandler(async(req, res) =>{
  await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new : true
    }
  )

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
  .clearCookie("accessToken", accessToken, option)
  .clearCookie("refreshToken", refreshToken, option)
  .json(new ApiResponse(200),{}, "user logged out!")
})


export { userRegister, userLogin };
