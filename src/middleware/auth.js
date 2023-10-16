import jwt from "jsonwebtoken";



// เช็ค JWT
export const auth = (req, res, next) => {
  try {
    const token = req.cookies.token
    console.log(token)

    if (!token) {
      return res.status(401).send("no token , authorization denied");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("middleware", decoded);
    req.user  = decoded.user
    res.status(200);
    next()
  } catch (err) {
    console.log(err);
    res.status(401).send("Error");
  }
};


// export const adminCheck = async(req, res, next) => {
//   try {
//     const { username } = req.user
//     const adminUser = await User.findOne({ username }).exec()
//     if(adminUser.role !== 'admin'){
//       res.status(403).send(err,'Admin Access denied')
//     } else{
//       next()
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(401).send("Admin Access denied");
//   }
// };