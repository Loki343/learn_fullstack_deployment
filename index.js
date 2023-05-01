const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");
require("dotenv").config()

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use(auth);
app.use("/notes", noteRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Cannot connected to DB");
    console.log(error);
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});
