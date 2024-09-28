import mongoose from "mongoose";
import express from "express";
import cors from "cors"
const DB_NAME = "assignment";

const port = 8000;
const connectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MOngo Db connect !! DB hosts: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(" mongo db connection error", error);
    process.exit(1);
  }
};


const app = express();


console.log(process.env.CORS_ORIGIN);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json())

import userRouter from "./routes/user.routes.js"

app.use("/api/user",userRouter);
app.use("/api/health",()=>{
    console.log(" great");
    return res.status(200);
})


try {
  connectionDB();
  console.log("connection establised");
  app.on("error", (error) => {
    console.log(" error of app is ", error);
  });

   app.listen(port, () => {
    console.log(" app is running on port ", port);
  });
} catch (error) {
    console.log(error);
}


