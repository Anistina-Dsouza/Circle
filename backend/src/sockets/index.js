const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket.IO connected:', socket.id);

        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation ${conversationId}`);
        });

        socket.on('leave_conversation', (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${socket.id} left conversation ${conversationId}`);
        });

        // Circle Rooms
        socket.on('join_circle', (circleId) => {
            socket.join(circleId);
            console.log(`User ${socket.id} joined circle ${circleId}`);
        });

        socket.on('leave_circle', (circleId) => {
            socket.leave(circleId);
            console.log(`User ${socket.id} left circle ${circleId}`);
        });

        // Add user to their personal room (for receiving notifications or new message events without having joined a specific conversation)

        socket.on('join_personal', (userId) => {
             socket.join(userId);
             console.log(`User ${socket.id} joined personal room ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected:', socket.id);
        });
    });

    console.log('Socket.IO initialized successfully');
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIo };
