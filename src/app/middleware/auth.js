const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_KEY = process.env.SECRETKEY;

//This middle ware is used to identify the user and
// assign all the resources that the user has to the request
const auth = async(req, res, next) => {
    //get token form Header
    const accessToken = req.header(`X-${process.env.SECRETKEY}-api`);
    const sessionId = req.header("Session-id");
    try {
        //get id of user by token and JWT_KEY
        const data = jwt.verify(accessToken,JWT_KEY );    
        //find user infomation from token and data
        const user = await User.findOne({ _id: data._id, 'sessionInfo.accessToken': accessToken });
        if (!user) {
           res.status(401).json(Error());
        }
        //set user data and token for request 
        req.user = user;
        req.accessToken = accessToken;
        req.sessionId = sessionId;
        //next to go the other middleware
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: error });
    }

}
module.exports = auth;