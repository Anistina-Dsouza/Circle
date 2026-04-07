const mongoose = require('mongoose');
require('dotenv').config();

console.log('Script started');
console.log('URI:', process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED');

const Circle = require('./src/models/Circle');

async function checkVisibility() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const all = await Circle.find({});
        console.log(`Total circles in DB: ${all.length}`);
        all.forEach(c => console.log(`- ${c.name} (${c.slug}) type: [${c.type}] isActive: ${c.isActive}`));

        const privateCircles = await Circle.find({ type: 'private' });
        console.log(`\nFiltered Private circles: ${privateCircles.length}`);
        
        const publicCircles = await Circle.find({ type: 'public' });
        console.log(`Filtered Public circles: ${publicCircles.length}`);

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkVisibility();
