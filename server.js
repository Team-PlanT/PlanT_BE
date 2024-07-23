const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");

const con = require("./src/config/database");

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const planRoutes = require("./src/routes/planRoutes");
const listRoutes = require("./src/routes/listRoutes");
const searchRoutes = require("./src/routes/searchRoutes");
const detailRoutes = require("./src/routes/detailRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/list", listRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/detail", detailRoutes);

con.on("error", (err) => {
  console.log("db error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Reconnecting to the database...");
    con.connect((err) => {
      if (err) {
        console.error("Error reconnecting to the database:", err);
      } else {
        console.log("Reconnected to the database.");
      }
    });
  } else {
    throw err;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});