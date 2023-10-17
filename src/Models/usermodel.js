import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
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
  profileImage: {
    type: String, 
  },
  otp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OTP'  
  },
  activity: [
    {
      activity:{
        type:String
      },
      detail:{
        type:String
      }
    }
  ],
  loginTimes: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  lastVideoWatched: {
    type:String, 
  },
  
}, { timestamps: true });

const User = mongoose.model('users', UserSchema);

export default User;