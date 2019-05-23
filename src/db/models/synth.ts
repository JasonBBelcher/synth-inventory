import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface ISynth extends Document {
  brand: string;
  imgUrl?: string;
  modelNumber: string;
  userId: IUser["_id"];
  year?: string;
}

const SynthSchema: Schema = new Schema({
  brand: { type: String, required: true },
  imgUrl: String,
  modelNumber: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: String }
});

export default mongoose.model<ISynth>("Synth", SynthSchema);
