import User from "../Models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';


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

export const sendConfirmationEmail = async (email) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'projectmlb8@gmail.com', 
        pass: 'eysw octl apos tyzb', 
      },
    });

    
    let info = await transporter.sendMail({
      from: 'projectmlb8@gmail.com', 
      to: email, 
      subject: 'Email Confirmation', 
      text: 'Please confirm your email.', 
      html: '<b>Please confirm your email.</b>', 
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('An error occurred while sending the email:', error);
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
    return res.send('User profile updated successfully');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Error updating user profile');
  }
};

