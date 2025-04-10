import ConnectDB from "./db/Connection.db.js";
import dotenv from "dotenv";
import {app}from './app.js'

dotenv.config();

ConnectDB()
  .then(() => app.listen(process.env.PORT || 8080, () =>{
    console.log(`server is listening on ${process.env.PORT}`)
  }) )
  .catch((error) => console.log("database connection faild!", error));


