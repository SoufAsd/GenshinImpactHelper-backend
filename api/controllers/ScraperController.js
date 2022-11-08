const puppeteer = require("puppeteer");
const connection = require("../../config/connection");
const axios = require("axios");
const cheerio = require("cheerio");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getAllAvatars = async (req, res) => {
  let client = await connection();
  db = await client.db("test");
  avatars = db.collection("avatarimages");
  let avatarCharacters = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("response", async (response) => {
    const url = response.url();
    if (
      response.request().resourceType() === "image" &&
      url.includes("/characters/")
    ) {
      avatarCharacters.push({
        name: url.split("characters/")[1].split(".png")[0],
        img: url,
      });
    }
  });
  await page.goto("https://paimon.moe/characters");
  avatars.deleteMany({});
  avatars.insertMany(avatarCharacters);
  await browser.close();
  return res.status(200).json(avatarCharacters);
};

exports.getEachCharacter = async (req, res) => {
  let client = await connection();
  db = await client.db("test");
  characters = db.collection("characters");
  avatars = await db.collection("avatarimages").find().toArray();
  try {
    let allcharacters = [];
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
        const uri1 =
          "https://api.genshin.dev/characters/" + item.name + "/list";
        const apiResponse = await fetch(uri1);
        const apiResponseJson = await apiResponse.json();
        response["name"] = item.name;
        if (!apiResponseJson.error) {
          response["image"] =
            "https://api.genshin.dev/characters/" + item.name + "/gacha-splash";
        } else {
          const uri = "https://paimon.moe/characters/" + item.name;
          await axios(uri).then((res) => {
            const html_data = res.data;
            const $ = cheerio.load(html_data);
            response["image"] =
              "https://paimon.moe" + $(".character-image").attr("src");
          });
        }
        allcharacters.push(response);
      })
    );
    characters.deleteMany({});
    characters.insertMany(allcharacters);
    return res.status(200).json(allcharacters);
  } catch (error) {
    console.log(error)
  }
};
