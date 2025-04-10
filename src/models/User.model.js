import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim : true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim : true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            unique: true,
            trim : true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim : true,
            lowercase: true,
            index: true
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vedio'
            }
        ],
        avatar: {
            type: String,
        },
        coverImg: {
            type: String
        },
        refreshToken: {
            type: String
        }

    },{timestamps: true}
)

userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10)
   next()
})

userSchema.methods.comparedPassword = async function(password){
  return await  bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.EXPIRE_ACCESS_TOKEN
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.EXPIRE_REFRESH_TOKEN
        }
    )
}

const User = new mongoose.model("User", userSchema)
export default User