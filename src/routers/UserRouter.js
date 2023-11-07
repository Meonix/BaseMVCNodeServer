const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../app/middleware/auth');
const userController = require('../app/controllers/UserController');
//POST LOGIN
router.post('/login',userController.getUser);
//POST CREATE USER
router.post('/create_user',
                            [check("email").isEmail().withMessage("email is not valid").trim()]
                            ,[check("password")
                            .isLength({min:7})
                            .withMessage("your password must be at least 7 characters")
                            .trim()],
                            [check("name").not().isEmpty().withMessage("name must be not null").trim()]
                        ,(req, res, next) => {
                            const error = validationResult(req).formatWith(({ msg }) => msg);

                            const hasError = !error.isEmpty();

                            if (hasError) {
                            res.status(422).json({ error: error.array() });
                            } else {
                            next();
                            }
                        }
                        ,
                        userController.create);

//GET METHOD TO GET USER'S PROFILE
router.get('/profile', auth,userController.profile);

router.post('/refresh_token', userController.refreshToken);

//auth params is the middleware to check user by token and get user info

//POST METHOD TO LOGOUT
router.post('/logout', auth,userController.logout);
//POST METHOD TO LOGOUT ALL DEVICES
// router.post('/users/me/logoutall', auth, async(req, res) => {
//     // Log user out of all devices
//     try {
//         req.user.tokens.splice(0, req.user.tokens.length)
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)}}

//GET USER LIST BY NAME
router.get('/search_user',userController.searchUser)
module.exports = router;