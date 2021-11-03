const { sequelize } = require("./models/index");
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const errorHandler = require("./middlewares/error");
const path = require("path");
const app = express();
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 5000;

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Get the routes
const userRoute = require("./routes/user");
const friendRequest = require("./routes/friend_requests");
const friend = require("./routes/friend");
const auth = require("./routes/auth");
const message = require("./routes/message");
const challenge = require("./routes/challenge");
const conversation = require("./routes/conversation");

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use the routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/friend_requests", friendRequest);
app.use("/api/v1/friends", friend);
app.use("/api/v1/auth", auth);
app.use("/api/v1/messages", message);
app.use("/api/v1/challenges", challenge);
app.use("/api/v1/conversations", conversation);

// Handle the errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App utilise le port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // app.close(() => process.exit(1));
});

// Create the database and tables
async function main() {
  await sequelize.sync();
}

main();
