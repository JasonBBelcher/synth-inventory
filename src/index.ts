import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import formidable from "express-formidable";
import morgan from "morgan";
import path from "path";
import connect from "./db/init";
import apiRoutes from "./routes/api";

const app = express();
const port = process.env.SERVER_PORT; // default port to listen
const db = process.env.MONGODB_DEV;
const uploadsBase = path.join(__dirname, "../uploads/images");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/uploads", express.static(uploadsBase));

app.use("/api/", apiRoutes);

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
connect({ db });
