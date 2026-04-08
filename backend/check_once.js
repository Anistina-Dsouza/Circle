const mongoose = require('mongoose');
require('dotenv').config();
const Circle = require('./src/models/Circle');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const c = await Circle.findOne({ slug: 'testers' });
        console.log('Circle testers info:', JSON.stringify(c, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
