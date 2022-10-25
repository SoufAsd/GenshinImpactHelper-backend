const mongoose = require('mongoose')


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URL)
    console.log(`Server Connected ${conn.connection.host}`)
    return conn.connection;
  } catch (error) {
    throw error
    process.exit(1)
  }
}
module.exports = connectDB