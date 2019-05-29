import mongoose from "mongoose";

const SynthSchema = new mongoose.Schema({
  brand: { type: String },
  imgUrl: String,
  modelNumber: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: String },
  description: { type: String },
  image: { data: String, contentType: String }
});

export default mongoose.model("Synth", SynthSchema);
