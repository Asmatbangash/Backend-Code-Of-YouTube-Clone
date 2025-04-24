import { Router } from "express";
import { userLogin, userRegister } from "../controllers/User.contoroller.js";
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

router.route('/logIn').post(userLogin)

export {router}