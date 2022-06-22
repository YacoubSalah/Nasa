const mongoose = require('mongoose')
const schema = mongoose.Schema
const postSchema = new schema({
    title: String,
    description: String,
    media: String,
    nasa_id: String,
    saved: { type: Boolean, default: true },
    thumbnail: String,
    mediaReady: {type:Boolean , default:false}
})

const postModel = mongoose.model('post', postSchema)

module.exports = postModel