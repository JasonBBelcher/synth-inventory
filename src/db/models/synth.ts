import mongoose, { Document, Schema } from "mongoose";
import { ISynth } from "../../ts-definitions";

const SynthSchema: Schema = new Schema({
  brand: { type: String },
  imgUrl: String,
  modelNumber: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: String },
  description: { type: String },
  image: { data: String, contentType: String }
});

export default mongoose.model<ISynth>("Synth", SynthSchema);
