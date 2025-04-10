import { Router } from "express";
import { userRegister } from "../controllers/User.contoroller.js";
import { upload } from "../middleware/Cloudinary.middleware.js";

const router = Router()
router.route('/register').post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'coverImg',
        maxCount: 1
    }
]),userRegister)


export {router}