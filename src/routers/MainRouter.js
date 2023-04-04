const userRouter = require('./UserRouter');
const { json } = require('express');
function route(app){
    app.use('/user',userRouter);
}

module.exports = route;