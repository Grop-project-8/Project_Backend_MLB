import mongoose from "mongoose";

const Schema = mongoose.Schema;

const YogaSchema = new Schema({
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
});

const YOGA = mongoose.model("yoga", YogaSchema);

export default YOGA;
