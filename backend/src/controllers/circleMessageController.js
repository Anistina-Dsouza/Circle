const CircleMessageService = require('../services/circleMessageService');
const { getIo } = require('../sockets');

exports.getMessages = async (req, res) => {
    try {
        const { before, limit = 30 } = req.query;
        const messages = await CircleMessageService.getMessages(
            req.params.circleId,
            req.userId,
            { before, limit: Math.min(Number(limit), 50) }
        );
        res.status(200).json({ messages });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { content, contentType, replyTo, mentions } = req.body;
        if (!content?.text && !content?.mediaUrl) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        const message = await CircleMessageService.createMessage({
            circleId: req.params.circleId,
            sender: req.userId,
            content,
            contentType,
            replyTo,
            mentions
        });

        try {
            getIo().to(req.params.circleId).emit('newCircleMessage', message);
        } catch (err) {
            console.error('Socket error:', err);
        }

        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) {
            return res.status(400).json({ error: 'Text cannot be empty' });
        }

        const message = await CircleMessageService.updateMessage(
            req.params.messageId,
            req.userId,
            text.trim()
        );

        try {
            getIo().to(req.params.circleId).emit('circleMessageUpdated', message);
        } catch (err) {
            console.error('Socket error:', err);
        }

        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        await CircleMessageService.deleteMessage(
            req.params.messageId,
            req.userId
        );

        try {
            getIo().to(req.params.circleId).emit('circleMessageDeleted', { messageId: req.params.messageId });
        } catch (err) {
            console.error('Socket error:', err);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.toggleReaction = async (req, res) => {
    try {
        const { emoji } = req.body;
        if (!emoji) {
            return res.status(400).json({ error: 'emoji required' });
        }

        const reactions = await CircleMessageService.toggleReaction(
            req.params.messageId,
            req.userId,
            emoji
        );

        try {
            getIo().to(req.params.circleId).emit('circleMessageReacted', { messageId: req.params.messageId, reactions });
        } catch (err) {
            console.error('Socket error:', err);
        }

        res.status(200).json({ reactions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { lastMessageId } = req.body;
        await CircleMessageService.markRead(
            req.params.circleId,
            req.userId,
            lastMessageId
        );

        try {
            getIo().to(req.params.circleId).emit('circleMessagesRead', { circleId: req.params.circleId, userId: req.user?._id || req.userId, lastMessageId });
        } catch (err) {
            console.error('Socket error:', err);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
