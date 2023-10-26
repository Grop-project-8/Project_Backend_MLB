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
    const id = req.body.id; 

   
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    const activityIndex = existingUser.activity.findIndex((act) => act._id == id);

    if (activityIndex === -1) {
      return res.status(404).send("Activity not found");
    }

    existingUser.activity.splice(activityIndex, 1);

    await existingUser.save();

    res.send("Activity deleted successfully");
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
}


export const editPost = async (req, res) => {

  try {
    const { id, updatedDetail, updatedDuration  } = req.body;

      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const username = decodedToken.user.username;

      const existingUser = await User.findOne({ username: username });

      if (!existingUser) {
        return res.status(404).send("User not found");
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

