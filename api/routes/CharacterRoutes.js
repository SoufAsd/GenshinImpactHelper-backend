const express = require("express");
const router = express.Router();
const characterController = require("../controllers/CharacterController");

router.get("/",  characterController.getCharacters);

router.get("/:charactername",  characterController.getCharacter);

module.exports = router ;