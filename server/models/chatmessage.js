/* ChatMessages mongoose model */
const mongoose = require('mongoose')

const ChatMessageSchema = new mongoose.Schema({
	username: {
		type: String,
        minlength: 1,
        trim: true,
        unique: false,
        index: { unique: false, dropDups: false }
	},
	content: {
		type: String,
		minlength: 1,
        unique: false,
        index: { unique: false, dropDups: false }
	},
});

// make a model using the ChatMessage schema
const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

module.exports = { ChatMessage }
