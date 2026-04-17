const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            next(new Error("Authentication error"));
        }
    });

    io.on('connection', async (socket) => {
        console.log('Socket.IO connected:', socket.id, 'User:', socket.userId);

        const userId = socket.userId;
        const userRoom = `user_${userId}`;
        socket.join(userRoom);

        // Mark user online immediately
        try {
            await User.findByIdAndUpdate(userId, {
                'onlineStatus.status': 'online'
            });
        } catch (err) {
            console.error("Error updating user online status:", err);
        }

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

        // Personal room for notifications
        socket.on('join_personal', (id) => {
            // Already joined during connection, but keeping this for compatibility
            socket.join(id);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected:', socket.id, 'User:', userId);
            
            // Check if user has other active connections after a short delay
            setTimeout(async () => {
                try {
                    const sockets = await io.in(userRoom).fetchSockets();
                    if (sockets.length === 0) {
                        // User is completely offline
                        await User.findByIdAndUpdate(userId, {
                            'onlineStatus.status': 'offline',
                            'onlineStatus.lastSeen': new Date()
                        });
                        console.log(`User ${userId} marked offline.`);
                    }
                } catch (err) {
                    console.error("Error updating user offline status:", err);
                }
            }, 5000);
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
