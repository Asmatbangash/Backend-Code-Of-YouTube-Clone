import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const userRegister = asyncHandler(async (req, res) => {
  const { userName, email, password, fullName} = req.body;
  // check validation
  if (
    [userName, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "username or email already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImg[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImg = await uploadOnCloudinary(coverImgLocalPath)

  if(!avatar){
    throw new ApiError(409, "Avatar file is required!")
  }

  User.create({
    fullName,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
    email,
    password,
    userName: userName.toLowerCase()
  })

  const createdUser = await User.findById(User._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "something went wrong while registring user")
  }
  return res.status(201).json(new ApiResponse(200, createdUser, "user register successfully"))
});

export { userRegister };
