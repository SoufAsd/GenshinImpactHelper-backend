const express = require("express");
const router = express.Router();
const ScraperController = require("../controllers/ScraperController");

router.get("/",  ScraperController.getAllAvatars);

module.exports = router ;