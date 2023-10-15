import User from "../Models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // req user
    const { username, password, email, weight, height } = req.body;

    const lowercaseEmail = email.toLowerCase();
    //cal bmi
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid Email Format");
    }
    // check user
    var user = await User.findOne({ $or: [{ username }, { email: { $regex: new RegExp(`^${lowercaseEmail}$`, "i") } }] });
    if (user) {
      return res.status(400).send("Username or Email already exists");
    }
    //gen salt
    const salt = await bcrypt.genSalt(10);
    user = new User({
      username,
      password,
      email,
      weight,
      height,
      bmi,
    });
    // Encrypt การเข้ารหัส
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.send("Register Success");
  } catch (err) {
    console.log(err);
    alert("Error");
    res.status(500).send("Error");
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    var user = await User.findOneAndUpdate({ username }, { new: true });
    if (user && user.enabled) {
      //check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send("username or password Invalid");
      }
      // Payload
      const payload = {
        user: {
          username: user.username,
          role: user.role,
        },
        loginTime: new Date(),
      };
      //Generate Token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        async (err, token) => {
          if (err) throw err;

          const lastIndex = user.loginTimes.length - 1;

          const latestLogin = user.loginTimes[lastIndex];
          if (
            latestLogin &&
            latestLogin.toDateString() === payload.loginTime.toDateString()
          ) {
            latestLogin.setTime(payload.loginTime.getTime());
          } else {
            user.loginTimes.push(payload.loginTime);
          }

          await user.save();

          res.cookie("token", token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });

          res.status(200).json({ message: "Login successful", payload ,token});
        }
      );
    } else {
      return res.status(400).send("User not Found!!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ isLoggedIn: false });
  } catch (err) {
    console.log(err);
    res.status(401).send("error");
  }
};

export const checkId = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(200)
        .json({ message: "Not logged in", isLoggedIn: false });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("middleware", decoded);
      req.user = decoded.user;
      // res.cookie('token', token, { httpOnly: true });
      return res.status(200).json({ message: "Logged in", isLoggedIn: true });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("error");
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username })
      .select("-password -email -_id")
      .exec();
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



