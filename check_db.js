const mongoose = require('mongoose');
const Circle = require('./backend/src/models/Circle');
require('dotenv').config({ path: './backend/.env' });

async function checkVisibility() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const privateCircles = await Circle.find({ type: 'private' });
        console.log(`Found ${privateCircles.length} private circles:`);
        privateCircles.forEach(c => console.log(`- ${c.name} (${c.slug}) type: ${c.type}`));
        
        const publicCircles = await Circle.find({ type: 'public' });
        console.log(`Found ${publicCircles.length} public circles:`);
        publicCircles.forEach(c => console.log(`- ${c.name} (${c.slug}) type: ${c.type}`));
        
        const otherCircles = await Circle.find({ type: { $notin: ['public', 'private'] } });
        console.log(`Found ${otherCircles.length} other circles:`);
        otherCircles.forEach(c => console.log(`- ${c.name} (${c.slug}) type: ${c.type}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkVisibility();
