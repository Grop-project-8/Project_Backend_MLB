// Import Model
import jwt from 'jsonwebtoken';
import User from "../Models/usermodel.js";



// Create Post
export const createPost = async (req, res) => {
  try {
    const { activity, detail,duration } = req.body;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const existingUser = await User.findOneAndUpdate({ username: username });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    existingUser.activity.push({ activity, detail,duration});
    const updatedUser = await existingUser.save();

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

// Edit Post
/* export const editPost = async (req,res) => {
    try {
        const id = req.body.id
        console.log(id);
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const username = decodedToken.user.username;

        const existingUser = await User.findOne({ username: username });
        if (!existingUser) {
          return res.status(404).send("User not found");
      }

        const updated = await User.findOneAndUpdate({ _id : id }).exec();
        res.send(updated)
    } catch (error) {
        res.status(500).send('Server error: ' + error.message)
    }
} */
// Edit Post
export const editPost = async (req, res) => {
  try {
    const { id, updatedActivity, updatedDetail } = req.body;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    // ค้นหาผู้ใช้โดยใช้ชื่อผู้ใช้
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    // ค้นหากิจกรรมที่ต้องการแก้ไขในรายการกิจกรรมของผู้ใช้
    const activityIndex = existingUser.activity.findIndex((act) => act._id == id);

    if (activityIndex === -1) {
      return res.status(404).send("Activity not found");
    }

    // อัปเดตข้อมูลกิจกรรม
    existingUser.activity[activityIndex].activity = updatedActivity;
    existingUser.activity[activityIndex].detail = updatedDetail;

    await existingUser.save();

    res.send("Activity updated successfully");
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

// Delete
export const deletePost = async (req, res) => {
  try {
      const id = req.body.id; // รับ ID ของกิจกรรมที่ต้องการลบจากคำขอ

      // ค้นหาผู้ใช้โดยใช้ ID หรืออื่น ๆ ที่คุณต้องการใช้ในการตรวจสอบสิทธิ์การลบ
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const username = decodedToken.user.username;

      const existingUser = await User.findOne({ username: username });

      if (!existingUser) {
          return res.status(404).send("User not found");
      }

      // ค้นหากิจกรรมที่ต้องการลบในรายการกิจกรรมของผู้ใช้
      const activityIndex = existingUser.activity.findIndex(act => act._id == id);

      if (activityIndex === -1) {
          return res.status(404).send("Activity not found");
      }

      // ลบกิจกรรมจากรายการกิจกรรมของผู้ใช้
      existingUser.activity.splice(activityIndex, 1);

      // บันทึกการเปลี่ยนแปลงในฐานข้อมูลโดยใช้ Mongoose
      await existingUser.save();

      res.send("Activity deleted successfully");

  } catch (error) {
      res.status(500).send("Server error: " + error.message);
  }
}




