"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: (v) => v.toLowerCase()
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "User", "Guest"]
    }
});
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        next();
    }
    bcrypt_1.default
        .hash(this.password, 10)
        .then(hashed => {
        this.password = hashed;
        next();
    })
        .catch(err => next(err));
});
UserSchema.methods.comparePassword = function (password, next) {
    const user = this;
    return bcrypt_1.default
        .compare(password, user.password)
        .then(compared => {
        return compared;
    })
        .catch(err => next(err));
};
UserSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ data: { id: this.id, username: this.username, role: this.role } }, process.env.SECRET_KEY, { expiresIn: "7d" });
    return token;
};
// Enable uniqueValidator on this schema
UserSchema.plugin(mongoose_unique_validator_1.default, {
    message: "Error, expected {PATH} to be unique."
});
const User = mongoose_1.default.model("User", UserSchema);
// Export the model and return your IUser interface
exports.default = User;
//# sourceMappingURL=user.js.map