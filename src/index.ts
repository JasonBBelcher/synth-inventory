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

// init config

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.use("/api/", apiRoutes);
// define a route handler for the default home page

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
connect({ db });
