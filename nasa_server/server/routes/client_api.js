const postModel = require('../model/post_model')
const nasaAPI = require('./nasa_api')
const route = require('express')
const api = route()

api.get("/nasaToday", async function (req, res) {
    let nasaToday = await nasaAPI.getNasaToday()
    if (nasaToday == "failed") {
        res.status(503).send("NASA APOD API error ")
    } else {
        res.send(nasaToday)
    }
})

api.get("/nasaLibrary/:searchWord", async function (req, res) {
    let searchWord = req.params.searchWord
    let nasaLibraryData = await nasaAPI.getNasaLibrary(searchWord)
    if (nasaLibraryData == "failed") {
        res.status(503).send("NASA image and video library API error ")
    } else {
        res.send(nasaLibraryData)
    }
})

api.get("/nasaMedia", async function (req, res) {
    let mediaLink = req.body.link
    let media = await nasaAPI.getLibraryMedia(mediaLink)
    if (media == "failed") {
        res.status(503).send("couldn't get NASA media")
    } else {
        res.send(media)
    }
})

api.get("/savedPosts", async function (req, res) {
    res.send(await postModel.find({}))
})

api.put("/savedPosts", async function (req, res) {
    let newPosts = req.body
    let newPostsIds = makeSetOfIds(newPosts)
    let savedPosts = await postModel.find({})
    let savedPostsIds = makeSetOfIds(savedPosts)
    removeUnsavedPostsFromDB(newPostsIds, savedPostsIds)
    addNewUnsavedPostsToDB(newPosts, savedPostsIds)
    res.send("Saved posts were updated")
})

function makeSetOfIds(posts) {
    let idSet = new Set()
    for (let post of posts) {
        idSet.add(post.nasa_id)
    }
    return idSet
}

function removeUnsavedPostsFromDB(newPostsIds, savedPostsIds) {
    for (id of savedPostsIds) {
        if (!newPostsIds.has(id)) {
            postModel.findOneAndDelete({ nasa_id: id })
                .exec()
        }
    }
}

function addNewUnsavedPostsToDB(newPosts, savedPostsIds) {
    for (let post of newPosts) {
        if (!savedPostsIds.has(post.nasa_id)) {
            post = new postModel(post)
            post.save()
                .then(console.log("Posts Saved"))
        }
    }
}

//just for testing
api.post('/savePostToDB', async function (req, res) {
    let newPost = new postModel(req.body)
    await newPost.save()
        .then(() => res.send("post saved"))
})
//just for testing

module.exports = api