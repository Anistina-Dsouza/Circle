const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const MessageService = require('./src/services/messageService');
      const User = require('./src/models/User');
      const Conversation = require('./src/models/Conversation');

      const user1 = await User.findOne();
      if (!user1) { console.log('No user found'); process.exit(0); }
      console.log('User1:', user1._id);

      const user2 = await User.findOne({ _id: { $ne: user1._id } });
      let convo = await Conversation.findOne();
      if (!convo) {
         convo = await Conversation.findOrCreateDirect(user1._id, user2._id);
      }
      
      console.log('Convo:', convo._id);
      
      const userId = convo.participants[0].user;
      
      // try to call the service
      await MessageService.createMessage({
         conversationId: convo._id,
         sender: userId,
         content: { text: 'test test' },
         contentType: 'text',
      })
      .then(console.log)
      .catch(e => console.error('Error from Service:', e));
      
      process.exit(0);
    } catch(e) {
      console.error('Fatal:', e);
      process.exit(1);
    }
  });
