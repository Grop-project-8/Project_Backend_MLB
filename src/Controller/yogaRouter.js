import WORKOUT from "../Models/Workout.js";

export const createYoga = async (req, res) => {
  try {
    const { youtube_embed_link, title, equipment, thumbnail,type } = req.body;
    // check link
    const yoga = await WORKOUT.findOne({ title: title });
    if (yoga) {
      return res.status(400).send("title already exists");
    }
    const NewWorkout = new WORKOUT({
      youtube_embed_link,
      title,
      equipment,
      thumbnail,
      type,
    });
    await NewWorkout.save();
    res.send("สร้างเสร็จแล้ว");
  } catch (error) {
    console.log(error);
  }
};

export const getyoga = async (req, res) => {
  try {
    const allVideo = await WORKOUT.find({});
    res.status(200).json(allVideo);
  } catch (error) {
    console.log(error);
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const yogaVideo = await WORKOUT.findById(id);
    if (!yogaVideo) {
      return res.status(404).json({ message: "video not found" });
    }
    res.status(200).json(yogaVideo);
  } catch (error) {
    console.log(error);
  }
};

export const updateYogaVideoById = async (req, res) => {
  try {
    const { id,youtube_embed_link, title, equipment, thumbnail } = req.body;
    const updatedYogaVideo = await WORKOUT.findByIdAndUpdate(
      id,
      { 
        youtube_embed_link,
        title,
        equipment,
        thumbnail 
      },
      { new: true }
    );
    if (!updatedYogaVideo) {
      return res.status(404).json({ message: "video not found" });
    }
    res.status(200).json({ message: "updated successfully", updatedYogaVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteYogaVideoById = async (req, res) => {
  try {
      const { id } = req.body;
      const deletedYogaVideo = await WORKOUT.findByIdAndRemove(id);
      if (!deletedYogaVideo) {
          return res.status(404).json({ message: "Yoga video not found" });
      }
      res.status(200).json({ message: "Yoga video deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}
