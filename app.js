const express = require("express");
const cors = require("cors");
const app = express();
const BodyParser = require("body-parser");

const Faculty = require("./routes/Faculty");
const course = require("./routes/course");
const Module = require("./routes/Module");
const db = require("./db");
const isAuth = require("./Middleware/isAuth");
const User = require("./routes/User");
const Staff = require("./routes/staff")
const Student = require("./routes/student")

app.use(isAuth);
app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(BodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/faculty", Faculty);
app.use("/course", course);
app.use("/module", Module);
app.use("/user", User);
app.use("/staff", Staff);
app.use("/student", Student);

db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(5001);
  }
});
