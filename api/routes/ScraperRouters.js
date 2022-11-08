const express = require("express");
const router = express.Router();
const ScraperController = require("../controllers/ScraperController");

router.get("/",  ScraperController.getAllAvatars);

router.get("/allcharacters",  ScraperController.getEachCharacter);

module.exports = router ;