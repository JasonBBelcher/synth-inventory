"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SynthSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    imgUrl: String,
    modelNumber: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    year: { type: String },
    description: { type: String }
});
exports.default = mongoose_1.default.model("Synth", SynthSchema);
//# sourceMappingURL=synth.js.map