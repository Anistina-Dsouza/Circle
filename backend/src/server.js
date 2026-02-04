require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initializeSocket } = require('./sockets');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`
      🚀 Circle Backend Server Started
      📍 Port: ${PORT}
      🌐 Environment: ${process.env.NODE_ENV}
      📊 Health: http://localhost:${PORT}/health
      🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local'}
      `);
    });

    // Initialize Socket.IO
    initializeSocket(server);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();