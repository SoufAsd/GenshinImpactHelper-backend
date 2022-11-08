let mongoose = require("mongoose");
const Character = require("../models/Character");
const connection = require("../../config/connection");
const connectionv2 = require("../../config/db");
const axios = require("axios");
const cheerio = require("cheerio");

var data = JSON.stringify({
  collection: "characters",
  database: "test",
  dataSource: "GenshinImpactHelper",
  filter: { name: "amber" },
});

var config = {
  method: "get",
  url: "https://data.mongodb-api.com/app/data-lqzez/endpoint/data/v1/action/findOne",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key":
      "bZm7TGiHXzzRHN4fkjoRPNYTaVaPf2L4PZutwFjmiFCRTkr3SH8984gYmnSAuJWo",
  },
  data: data,
};

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getAllCharacters = async (req, res) => {
  let client = await connectionv2();
  characters = await client.collection('avatarimages').find().toArray();
  return res.status(200).json(characters);
  // let client = await connection();
  // db = await client.db("test");
  // characters = await db.collection("avatarimages").find().toArray();
  // return res.status(200).json(characters);

  // axios(config)
  //   .then(function (response) {
  //       return res.status(200).json(response.data);
  //   })
  //   .catch(function (error) {
  //       console.log(error);
  //   });
};

exports.getCharacter = async (req, res) => {
  const url = "https://api.genshin.dev/characters/" + req.params.charactername;
  const options = {
    method: "GET",
  };
  fetch(url, options)
    .then((res) => res.json())
    .catch((err) => console.error("error:" + err));
  try {
    let response = await fetch(url, options);
    response = await response.json();
    const uri1 =
      "https://api.genshin.dev/characters/" +
      req.params.charactername +
      "/list";
    const apiResponse = await fetch(uri1);
    const apiResponseJson = await apiResponse.json();
    console.log(apiResponseJson.error);
    if (!apiResponseJson.error) {
      response["image"] =
        "https://api.genshin.dev/characters/" +
        req.params.charactername +
        "/gacha-splash";
    } else {
      const uri = "https://paimon.moe/characters/" + req.params.charactername;
      await axios(uri).then((res) => {
        const html_data = res.data;
        const $ = cheerio.load(html_data);
        response["image"] =
          "https://paimon.moe" + $(".character-image").attr("src");
      });
    }
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
};
exports.getMyCharacter = async (req, res) => {
  let client = await connectionv2();
  character = await client.collection('characters').find({"name":req.params.charactername}).toArray();
  // let client = await connection();
  // db = await client.db("test");
  // character = await db.collection("characters").find({"name":req.params.charactername}).toArray();

  return res.status(200).json(character);
};

exports.getCharacters = async (req, res) => {
  let client = await connection();
  db = await client.db("test");
  avatars = await db.collection("avatarimages").find().toArray();
  let results = await Promise.all(
    avatars.map(async (item) => {
      const url = "https://api.genshin.dev/characters/" + item.name;
      const options = {
        method: "GET",
      };
      fetch(url, options)
        .then((res) => res.json())
        .catch((err) => console.error("error:" + err));
      let response = await fetch(url, options);
      response = await response.json();
      return await response;
    })
  );
  return res.status(200).json(results);
};
