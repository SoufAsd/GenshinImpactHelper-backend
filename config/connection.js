const {MongoClient} = require('mongodb');

const connection = async (req, res) => {
    const client = new MongoClient(process.env.URL);
    await client.connect();
    return client;
}

module.exports = connection