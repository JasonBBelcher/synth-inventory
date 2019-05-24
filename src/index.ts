import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import path from "path";
import connect from "./db/init";
import apiRoutes from "./routes/api";
const app = express();
const port = process.env.SERVER_PORT; // default port to listen
const db = process.env.MONGODB_DEV;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.use("/api/", apiRoutes);

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
connect({ db });
