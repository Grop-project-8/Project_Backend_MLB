// Import Model
import jwt from 'jsonwebtoken';
import User from "../Models/usermodel.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { activitytype , activityname , detail , duration , createdAt } = req.body;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;
    
    const existingUser = await User.findOneAndUpdate({ username: username });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }
    if (activityname.length < 2 || activitytype.length < 2) {
      return res.status(400).send("Activity name and type must be at least 2 characters long");
    }
    if (duration <= 1) {
      return res.status(400).send("Duration must be greater than 0");
    }
    if (detail.length < 2) {
      return res.status(400).send('Please enter details')
    }

    existingUser.activity.push({ activitytype,activityname, detail,duration,createdAt });
    const updatedUser = await existingUser.save();

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

// Delete
export const deletePost = async (req, res) => {
  try {
    const id = req.body.id; // รับ ID ของกิจกรรมที่ต้องการลบจาก req.body

    // ค้นหาผู้ใช้โดยใช้ ID หรืออื่น ๆ ที่คุณต้องการใช้ในการตรวจสอบสิทธิ์การลบ
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    // ค้นหากิจกรรมที่ต้องการลบในรายการกิจกรรมของผู้ใช้
    const activityIndex = existingUser.activity.findIndex((act) => act._id == id);

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


export const editPost = async (req, res) => {
/*   console.log('body', req.body); */

  try {
    const { id, updatedDetail, updatedDuration  } = req.body;

      // ค้นหาผู้ใช้โดยใช้ ID หรืออื่น ๆ ที่คุณต้องการใช้ในการตรวจสอบสิทธิ์การลบ
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const username = decodedToken.user.username;

      const existingUser = await User.findOne({ username: username });

      if (!existingUser) {
        return res.status(404).send("User not found");
    }
    if (updatedDetail.length < 2) {
      return res.status(400).send("Activity name and type must be at least 2 characters long");
    }
    if (duration <= 1) {
      return res.status(400).send("Duration must be greater than 0");
    }

     const update = await User.findOneAndUpdate({"activity._id": id },
      {
        $set: {
          "activity.$.detail": updatedDetail,
          "activity.$.duration": updatedDuration,
          "activity.$.createdAt": Date.now()
        }
      },
      { new: true }
    )
      res.send(update)
  } catch (error) {
    console.log(error);
  }
}