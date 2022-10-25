
const puppeteer = require('puppeteer');
const connection = require("../../config/connection")
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.getAllAvatars = async (req, res) => {
    let client = await connection();
    db = await client.db("test");
    avatars = db.collection("avatarimages")
    let avatarCharacters = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('response', async response => {
        const url = response.url();
        if (response.request().resourceType() === 'image' && url.includes("/characters/")) {
            avatarCharacters.push({
                name: url.split('characters/')[1].split('.png')[0],
                img: url,
              })
        }
    });
    await page.goto('https://paimon.moe/characters');
    avatars.deleteMany({})
    avatars.insertMany(avatarCharacters)
    await browser.close();
    return res.status(200).json(avatarCharacters);
};

