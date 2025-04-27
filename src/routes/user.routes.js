import { Router } from "express";
import { changeCurrentUserPassword, getCurrentUser, refreshAcessToken, updateAcountDetail, updateUserAvatar, updateUserCoverImg, userLogin, userLogOut, userRegister } from "../controllers/User.contoroller.js";
import { upload } from "../middleware/Cloudinary.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

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
router.route('/logOut').post(verifyJWT,userLogOut)
router.route('/refresh-token').post(refreshAcessToken)
router.route('/change-current-password').post(verifyJWT,changeCurrentUserPassword)
router.route('/current-user').get(verifyJWT,getCurrentUser)
router.route('/update-acount-detail').post(verifyJWT,updateAcountDetail)
router.route('/update-avatar').post(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route('/update-cover-img').post(verifyJWT,upload.single("coverImg"),updateUserCoverImg)

export {router}