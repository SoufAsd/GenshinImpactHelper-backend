const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {MongoClient} = require('mongodb');
const config = require("./config/db");
const characterRoutes = require("./api/routes/CharacterRoutes.js");
const scraperRoutes = require("./api/routes/ScraperRouters");
var imgModel = require('./api/models/AvatarImage.js');

require('dotenv').config()
const app = express();
//registering cors
app.use(cors());
//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configure body-parser ends here
app.use(morgan("dev")); // configire morgan
// define first route
app.get("/", (req, res) => {
  res.json(["Welcome Genshin Impact Helper","for characters : /characters","for each character : /characters/NAME"]);
});
// define routes
app.use("/character", characterRoutes);
app.use("/scraper", scraperRoutes);

const init = async () => {
  config();
};
//
app.listen(PORT,async () => {
  await init();
  console.log(process.env.URL) 
  console.log(`App is running on ${PORT}`);
});