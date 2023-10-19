import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  youtube_embed_link: {
    type: String,
  },
  title: {
    type: String,
  },
  equipment: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  type:{
    type:String,
  }
});

const WORKOUT = mongoose.model("workout", WorkoutSchema);

export default WORKOUT;
