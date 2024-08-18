import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./dbConnection.js";
import cookieParser from "cookie-parser";
import {
  addData,
  deleteData,
  getData,
  updateData,
} from "./controllers/todoController.js";
import {
  forgetPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "./controllers/userController.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    methods: "GET,POST,PUT,DELETE", // Allow only specific methods
  })
);

// Define routes

//Here ll user registration

app.post("/register", registerUser);
app.post("/login", loginUser);
app.use("/forget", forgetPassword);
app.use("/resetpassword", resetPassword);

// Here all todo crud opperation

app.post("/adddata", addData);
app.get("/getData", getData);
app.put("/updatedata/:id", updateData);
app.delete("/deletedata/:id", deleteData);

// Database connection and server running
databaseConnection()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () =>
      console.log(`Server is successfully running on port number ${PORT}`)
    );
  })
  .catch((err) => {
    console.log(`Failed to connect to the database ${err}`);
  });
