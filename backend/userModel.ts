const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    passwordHash: String,
    username:{
        type: String,
        required: true,
        unique: true
    },
    streak: {
        type: Number,
        default: 0
    },
    highscore: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
})
userSchema.set("toJSON", {
    transform: (doc: any, ret: any) => {
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
    },
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)