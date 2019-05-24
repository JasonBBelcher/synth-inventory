import mongoose from "mongoose";
import { IInput } from "../ts-definitions";

export default ({ db }: IInput) => {
  const connect = () => {
    mongoose
      .connect(db, { useNewUrlParser: true })
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error("Error connecting to database: ", error);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
