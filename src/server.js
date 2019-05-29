import connect from "./db/init";
import app from "./index";
const port = process.env.SERVER_PORT || 3001; // default port to listen
const db =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_TEST
    : process.env.MONGODB_DEV;
// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

connect({ db });
