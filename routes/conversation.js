const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getConversation,
  getConversations,
  createConversation,
} = require("../controllers/conversation");

const router = express.Router();

router.use(protect);

router.route("/").get(getConversations).post(createConversation);
router.route("/:id").get(getConversation);

module.exports = router;
