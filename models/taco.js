const mongoose = require('mongoose');
const Comment = require('./comment');
mongoose.set('useCreateIndex', true);

const tacoSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    address: String,
    zip: String,
    state: String,
    city: String,
    rating: Number
});

// Ensures all comments associated with Taco is delete when Taco is deleted
tacoSchema.pre('remove', async function(next) {
    try{
        await Comment.remove({
            _id: {
                $in: this.comments
            }
        });
        next();
    } catch(err){
        next(err)
    }
});

const Taco = mongoose.model('Taco', tacoSchema);

module.exports = Taco;