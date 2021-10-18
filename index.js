const { sequelize } = require("./models/index");
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middlewares/error");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Body parser
app.use(express.json());

// Get the routes
const userRoute = require("./routes/user");
const friendRequest = require("./routes/friend_requests");

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use the routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/friend_requests", friendRequest);

// Handle the errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App utilise le port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
   app.close(() => process.exit(1));
});

// Create the database and tables
async function main() {
  await sequelize.sync({force:true}
    );
}

main();
