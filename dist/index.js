"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const init_1 = __importDefault(require("./db/init"));
const api_1 = __importDefault(require("./routes/api"));
const app = express_1.default();
const port = process.env.SERVER_PORT; // default port to listen
const db = process.env.MONGODB_DEV;
app.use(morgan_1.default("dev"));
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "index.html"));
});
app.use("/api/", api_1.default);
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
init_1.default({ db });
//# sourceMappingURL=index.js.map