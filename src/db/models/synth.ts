import mongoose, { Document, Schema } from "mongoose";
import { ISynth } from "../../ts-definitions";

const SynthSchema: Schema = new Schema({
  brand: { type: String, required: true },
  imgUrl: String,
  modelNumber: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: String },
  description: { type: String }
});

export default mongoose.model<ISynth>("Synth", SynthSchema);
