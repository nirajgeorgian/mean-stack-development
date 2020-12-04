import mongoose, { mongo } from "mongoose";
import config from "../config";

const connectDb = () => {
  /**
   * Create db connection
   */

  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  mongoose.connection.on("connected", function () {
    console.log("connected to mongodb");
  });

  mongoose.connection.on("error", function () {
    console.log("error on mongodb connection");
  });
};

export default connectDb;
