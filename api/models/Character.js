let mongoose = require("mongoose");
let characterSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
    },
    vision: {
      type: String,
      required: true
    },
    weapon: {
        type: String,
        required: true
    },
    rarity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    skillTalents: {
        type: Object,
        required: true
    },
    passiveTalents: {
        type: Object,
        required: true
    },
    image: {
      data:Buffer,
      contentType: String
    },
    created: {
      type: Date,
      default: Date.now()
    }
  });

  
  let Character = mongoose.model("Character", characterSchema);
  module.exports = Character;