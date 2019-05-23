import express from "express";
import path from "path";
import dotenv from "dotenv";
const app = express();
const port = 8080; // default port to listen

// init config
dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.render("index");
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
