const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database Connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = { dbConnect };