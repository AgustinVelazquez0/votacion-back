const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getCandidates,
  vote,
  getResults,
  getUserStatus,
  getElection,
  resetUserVote,
} = require("../controllers/votingController");

router.get("/candidates", getCandidates);
router.post("/vote", verifyToken, vote);
router.get("/results", getResults);
router.get("/user-status", verifyToken, getUserStatus);
router.get("/election", verifyToken, getElection);
router.delete("/reset-vote", verifyToken, resetUserVote);

module.exports = router;
