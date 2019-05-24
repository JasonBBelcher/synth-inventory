"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const synth_1 = __importDefault(require("../db/models/synth"));
const user_1 = __importDefault(require("../db/models/user"));
const auth_1 = __importDefault(require("../middleware/auth"));
router
    .get(`/synths`, (req, res) => {
    synth_1.default.find({})
        .populate("user", "username email -_id")
        .exec()
        .then(results => {
        return res.status(200).json(results);
    })
        .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
    });
})
    .post(`/synths`, auth_1.default, (req, res) => {
    const synthBody = Object.assign({}, req.body, {
        user: req.user.data.id
    });
    synth_1.default.create(synthBody)
        .then(results => {
        return res.status(201).json(results);
    })
        .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
    });
})
    .post(`/user/register`, (req, res) => {
    user_1.default.create(req.body)
        .then(user => {
        const { id, username } = user;
        const token = user.generateAuthToken();
        return res.status(201).json({ id, username, token });
    })
        .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
    });
})
    .post(`/user/login`, (req, res) => {
    user_1.default.findOne({
        $or: [
            {
                email: req.body.email
            },
            { username: req.body.username }
        ]
    })
        .exec()
        .then(user => {
        if (user === undefined || user === null) {
            return res
                .status(400)
                .json({ error: { message: "User does not exist!" } });
        }
        const { id, username, email } = user;
        user.comparePassword(req.body.password).then(isMatch => {
            if (isMatch) {
                const token = user.generateAuthToken();
                return res.status(200).json({
                    id,
                    username,
                    email,
                    token
                });
            }
            else {
                return res
                    .status(400)
                    .json({ error: { message: "invalid email or password" } });
            }
        });
    })
        .catch(err => res.status(400).json({ error: { message: err.message } }));
});
exports.default = router;
//# sourceMappingURL=api.js.map