const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    bot: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    book: {
        key: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        author_name: {
            type: [String],
            default: []
        }
    },

    messages: [messageSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

module.exports = Conversation;
