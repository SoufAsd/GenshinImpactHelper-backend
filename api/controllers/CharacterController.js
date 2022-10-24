let mongoose = require("mongoose");
const Character = require("../models/Character");

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.getAllCharacters = async (req, res) => {
        const url =
            'https://api.genshin.dev/characters';
        const options = {
            method: 'GET'
        };
        fetch(url, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
        try {
            let response = await fetch(url, options);
            response = await response.json();
            return res.status(200).json(response);
        } catch (err) {
            console.log(err);
            res.status(500).json({msg: `Internal Server Error.`});
        }
  };

  exports.getCharacter = async (req, res) => {
    const url =
        'https://api.genshin.dev/characters/'+ req.param("charactername");
    const options = {
        method: 'GET'
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
    try {
        let response = await fetch(url, options);
        response = await response.json();
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: `Internal Server Error.`});
    }
};