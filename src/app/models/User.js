const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const JWT_KEY = process.env.SECRETKEY;

const UserSchema = new Schema({
    name:{type:String,required:true},
    email: {type:String,
            required:true,
            unique: true,
            lowercase: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email address'})
                }
            }
    },
    password: {type:String,required:true,minLength: 7},
    tokens: [{
      token: {
          type: String,
          required: true
      }
    }],
    error:{type:String}
  },{
    timestamps: true
  });

  UserSchema.pre('save', async function (next) {
      // Hash the password before saving the user model
      const user = this;
      if (user.isModified('password')) {
          user.password = await bcrypt.hash(user.password, 8);
      }
      next();
  });
  UserSchema.methods.generateAuthToken = async function() {
      // Generate an auth token for the user
      const user = this
      const token = jwt.sign({_id: user._id}, JWT_KEY)
      user.tokens = user.tokens.concat({token})
      await user.save()
      return token
  }

  UserSchema.statics.findEmailAvailable = async (email) => {
        const available = await User.findOne({email})
        if(available){
          return true;
        }
        else{
          return false;
        }
  }


  UserSchema.statics.findByCredentials = async (email, password) => {
      // Search for a user by email and password.
      const user = await User.findOne({ email} )
      if (!user) {
          return false
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
          return false
      }
      return user
  }

  UserSchema.statics.findUserByName = async (name) => {
    // Search for a user by email and password.
    const userList = await User.aggregate([
      // Match first to reduce documents to those where the array contains the match
      { "$match": {
          "name": { "$regex": name}
      }},
      // Unwind to "de-normalize" the document per array element
      // { "$unwind": "$authors" },

      // Now filter those document for the elements that match
      // { "$match": {
      //     "authors": { "$regex": "Alex", "$options": i }
      // }},

      // Group back as an array with only the matching elements
      { "$group": {
          "_id": "$_id",
          // "name": { "$push": "$name" }, // using $push for array
           "name": { "$first": "$name" },
          // "subjects": { "$first": "$subjects" }
      }}
    ])

    if (!userList) {
        return false
    }

    return userList
}

  UserSchema.statics.findUserById = async (id) =>{
    let objId = mongoose.Types.ObjectId(id);
    const userInfo = await User.aggregate([
      { "$match": { "_id": objId } },
      { "$group": {
        "_id": "$_id",
         "name": { "$first": "$name" },
      }}
    ])
    // console.log(userInfo)
    return userInfo
  }

const User = mongoose.model('User',UserSchema);
module.exports = User;