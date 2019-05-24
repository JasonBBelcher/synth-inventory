"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        const err = new Error("Access denied. No token provided.");
        return res.status(401).json({ error: { message: err } });
    }
    token = token.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log(decoded);
        return next();
    }
    catch (ex) {
        return res.status(401).json({ error: { message: ex.message } });
    }
    return next();
};
exports.default = authenticate;
//# sourceMappingURL=auth.js.map