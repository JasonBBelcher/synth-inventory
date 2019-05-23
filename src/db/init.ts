import mongoose from "mongoose";

interface IInput {
  db: string;
}

export default ({ db }: IInput) => {
  const connect = () => {
    mongoose
      .connect(db, { useNewUrlParser: true })
      .then(() => {
        // tslint:disable-next-line:no-console
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error("Error connecting to database: ", error);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
