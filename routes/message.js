const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/message");

const router = express.Router();

router.use(protect);

router.route("/").get(getMessages).post(createMessage);

router.route("/:id").put(updateMessage).delete(deleteMessage);

router.route("/:userId").post(createMessage);

module.exports = router;
