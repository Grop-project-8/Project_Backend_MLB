import User from "../Models/usermodel.js";
import OTP from "../Models/OTP.js";
import WORKOUT from "../Models/Workout.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createImage = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: username, 
      resource_type: "auto",
    });
    await User.findOneAndUpdate(
      { username: username },
      { profileImage: result.secure_url },
      { new: true }
    );
    
    res.send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send("Upload Error!!!");
  }
};

export const addlastVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send("Token not found");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).send("Username not Found");
    }

    const videoIndex = user.lastVideoWatched.indexOf(videoId);

    if (videoIndex !== -1) {
      user.lastVideoWatched.splice(videoIndex, 1);
    }

    user.lastVideoWatched.push(videoId);
    await user.save();
    return res.status(200).json({ success: true, message: "Video ID added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const findVideo = async (req, res) => {
  try {

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const videoId = user.lastVideoWatched; 
    const videos = await WORKOUT.find({ _id: { $in: videoId  } });

    if (!videos) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    return res.status(200).json({ success: true, videos });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getUserdata = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;
    const weeklyActivityDuration = {
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
      Sat: {},
      Sun: {}
    };
    activities.forEach((activity) => {
      const { activitytype, duration, createdAt } = activity;
      const activityDate = new Date(createdAt);

      const day = activityDate.toLocaleDateString('en-US', { weekday: 'short' });

      if (weeklyActivityDuration[day][activitytype]) {
        weeklyActivityDuration[day][activitytype] += duration; 
      } else {
        weeklyActivityDuration[day][activitytype] = duration; 
      }
    });

    const formattedData = Object.keys(weeklyActivityDuration).map(day => ({
      YOGA: weeklyActivityDuration[day]["YOGA"] || 0,
      JUMPPINGROPE: weeklyActivityDuration[day]["JUMPPINGROPE"] || 0,
      BODYWEIGHT: weeklyActivityDuration[day]["BODYWEIGHT"] || 0,
      PELATIST: weeklyActivityDuration[day]["PELATIST"] || 0,
      month: day
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserperday = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const activities = user.activity; // ดึงกิจกรรมทั้งหมดของผู้ใช้

    const today = new Date(); // วันที่ปัจจุบัน

    const activityDuration = {};

    activities.forEach((activity) => {
      const { activitytype, duration, createdAt } = activity;
      const activityDate = new Date(createdAt); // วันที่ของกิจกรรม

      // ตรวจสอบว่ากิจกรรมเกิดขึ้นในวันเดียวกันกับวันปัจจุบันหรือไม่
      if (
        activityDate.getDate() === today.getDate() &&
        activityDate.getMonth() === today.getMonth() &&
        activityDate.getFullYear() === today.getFullYear()
      ) {
        if (activityDuration[activitytype]) {
          activityDuration[activitytype] += duration; // ถ้ามีแล้วให้บวก duration เข้าไป
        } else {
          activityDuration[activitytype] = duration; // ถ้ายังไม่มีให้เพิ่มค่าใหม่
        }
      }
    });

    res.status(200).json(activityDuration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.cookies.token;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const user = await User.findOne({ username: username });

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (passwordMatch) {
      if (oldPassword === newPassword) {
        res
          .status(400)
          .send("New password must be different from old password");
      } else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne(
          { username: username },
          { password: hashedNewPassword }
        );
        sendConfirmationEmail(user.email);
        await user.save();
        res.status(200).send({ message: "Password updated successfully" });
      }
    } else {
      res.status(401).send("password is incorrect");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const removeImage = async (req, res) => {
  try {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Remove Error!!!");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.user.username },
      { password: 0, email: 0, _id: 0 }
    ).exec();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(403).send("Access denied");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { weight, height } = req.body;
    const token = req.cookies.token;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const user = await User.findOne({ username: username });
    user.weight = weight;
    user.height = height;

    const heightInMeters = height / 100;
    user.bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    await user.save();
    return res.send("User profile updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error updating user profile");
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const lowercaseEmail = email.toLowerCase();
    // ตรวจสอบว่ามีผู้ใช้ในระบบหรือไม่
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + lowercaseEmail + "$", "i") },
    });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const generatedOTP = generateOTP();
    const newOTP = new OTP({
      userId: user._id,
      otp: generatedOTP,
    });
    await newOTP.save();
    // ส่ง OTP ไปยังอีเมลของผู้ใช้
    await sendotptomail(lowercaseEmail, generatedOTP);
    res.send({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error sending OTP");
  }
};

export const rePass = async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    console.log(newPassword);
    const foundOTP = await OTP.findOne({ otp });
    if (!foundOTP) {
      return res.status(400).send("Invalid OTP");
    }

    const user = await User.findOne({ _id: foundOTP.userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    // ลบ OTP จากฐานข้อมูล
    await OTP.findOneAndDelete({ _id: foundOTP._id });
    res.status(200).send("Password Changed Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating password");
  }
};

// ฟังก์ชั่นแยก
const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const sendConfirmationEmail = async (email) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "projectmlb8@gmail.com",
        pass: "eysw octl apos tyzb",
      },
    });

    let info = await transporter.sendMail({
      from: "projectmlb8@gmail.com",
      to: email,
      subject: "Email Confirmation",
      text: "Please confirm your email.",
      html: "<b>Please confirm your email.</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("An error occurred while sending the email:", error);
  }
};

const sendotptomail = async (email, generatedOTP) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "projectmlb8@gmail.com",
        pass: "eysw octl apos tyzb",
      },
    });

    let info = await transporter.sendMail({
      from: "projectmlb8@gmail.com",
      to: email,
      subject: "Email Confirmation",
      text: `Your OTP is ${generatedOTP}`,
      html: `<b>Your OTP is ${generatedOTP}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("An error occurred while sending the email:", error);
  }
};
