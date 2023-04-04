const User = require('../models/User');
class UserController{
    async getUser(req,res,next){
        try {
            const { email, password } = req.body;
            const userFullData = await User.findByCredentials(email, password);
            if (!userFullData) {
                return res.status(401).json({data: null,error: 'Login failed! Check authentication credentials'})
            }
            const token = await userFullData.generateAuthToken();
            const user = {
                _id:userFullData._id,
                name:userFullData.name,
                email:userFullData.email,
            }
            // res.status(200).send({ user, token });
            res.status(200).json({data:{user:user,token:token},error:""})
        } catch (error) {
            res.status(400).json({data:null,error:error});
        }
        next()
    }


    async create(req,res,next){
        try {
            if(await User.findEmailAvailable(req.body.email))
            {
                res.status(409).json({data:null,error: 'email is already exist'});
            }
            else{
                const user = new User(req.body)
                await user.save()
                const token = await user.generateAuthToken()
                res.status(201).json({ data:{user:user, token:token},error: "" })
            }

        } catch (error) {
            res.status(400).json({data:null,error:error})
        }
        next()
    }

    async profile(req, res){
        // View logged in user profile
        res.send(req.user);
    }

    async logout(req, res){
        // Log user out of the application
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token;
            });
            await req.user.save();
            res.status(200).json({ data:"succcess",error: null})
        } catch (error) {
            res.status(500).json({data:null,error:error})
        }
    }

    async searchUser(req,res,next){
        try {
            const userList = await User.findUserByName(req.query.name)
            res.status(200).json({ data:{userList:userList},error: "" })
        } catch (error) {
            console.log(error)
            res.status(400).json({data:null,error:error})
        }
        next()
    }
}
module.exports = new UserController;