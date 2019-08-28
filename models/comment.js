const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const commentSchema = new mongoose.Schema({
    text: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;