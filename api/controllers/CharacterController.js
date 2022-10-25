let mongoose = require("mongoose");
const Character = require("../models/Character");
const connection = require("../../config/connection");
const axios = require("axios");
const cheerio = require("cheerio");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getAllCharacters = async (req, res) => {
  const url = "https://api.genshin.dev/characters";
  const options = {
    method: "GET",
  };
  fetch(url, options)
    .then((res) => res.json())
    .catch((err) => console.error("error:" + err));
  try {
    let response = await fetch(url, options);
    response = await response.json();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
};

exports.getCharacter = async (req, res) => {
  const url =
    "https://api.genshin.dev/characters/" + req.params.charactername;
  const options = {
    method: "GET",
  };
  fetch(url, options)
    .then((res) => res.json())
    .catch((err) => console.error("error:" + err));
  try {
    let response = await fetch(url, options);
    response = await response.json();
    const uri = "https://paimon.moe/characters/"+req.params.charactername;
    await axios(uri).then((res) => {
      const html_data = res.data;
      const $ = cheerio.load(html_data);
      response["image"] = 'https://paimon.moe'+$('.character-image').attr('src');
    });
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
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
