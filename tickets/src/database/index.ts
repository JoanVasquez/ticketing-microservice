import mongoose, { ConnectOptions } from "mongoose";
import { ErrorException } from "@jvtickets22/common-node-express";

export default async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined");
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
    } as ConnectOptions);
    console.log("Conneted to MONGO");
    return connection;
  } catch (error: any) {
    throw new ErrorException({ status: 500, message: error.message });
  }
};
