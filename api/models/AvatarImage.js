var mongoose = require('mongoose');
var AvatarImageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    img:{data:Buffer,contentType: String}
});
  
module.exports = new mongoose.model('AvatarImage', AvatarImageSchema);