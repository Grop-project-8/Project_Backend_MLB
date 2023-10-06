import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,unique:true
  },
  password: {
    type: String,
    validate:[
      function(password){
        return password && password.length>= 6;
      },
      'Password must be at least 6 characters'
    ]
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  bmi: {
    type: Number,
  },
  role: {
    type: String,
    default: 'user'
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  loginTimes: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  lastVideoWatched: {
    type:String, 
  }
}, { timestamps: true });

const User = mongoose.model('users', UserSchema);

export default User;


