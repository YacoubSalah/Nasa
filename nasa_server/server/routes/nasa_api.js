const axios = require('axios').default

let nasaAPIKey = "w6Y3xZHigza5bZeSHqJfrrePeJH2D1qB3H0Su0b2"

async function getNasaToday() {
    let link = `https://api.nasa.gov/planetary/apod?api_key=${nasaAPIKey}`
    let nasaToday
    await axios.get(link)
        .then((nasaTodayRawData) => nasaToday = filterNasaTodayRawData(nasaTodayRawData))
        .catch(() => nasaToday = "failed")
    return nasaToday
}

async function getNasaLibrary(keyword) {
    let libraryData
    link = `https://images-api.nasa.gov/search?q=${keyword}`
    await axios.get(link)
        .then(nasaLibraryRawData => {
            libraryData = filterNasaLibraryRawData(nasaLibraryRawData)
        }
        )
        .catch(() => libraryData = "failed")
    return libraryData
}

async function getLibraryMedia(mediaLink) {
    let media
    await axios.get(mediaLink)
        .then((res) => media = res.data)
        .catch(() => media = "failed")
    return media
}

function filterNasaTodayRawData(nasaTodayRawData) {
    let rawData = nasaTodayRawData.data
    nasaTodayFilterdData = {
        title: rawData.title,
        description: rawData.explanation,
        media: rawData.url
    }
    return nasaTodayFilterdData
}

function filterNasaLibraryRawData(nasaLibraryRawData) {
    let rawData = nasaLibraryRawData.data.collection.items
    return rawData.map(r => ({
        'title': r.data[0].title,
        'description': r.data[0].description,
        'nasa_id': r.data[0].nasa_id,
        'media': r.href
    }))
}

module.exports = { getNasaToday, getNasaLibrary, getLibraryMedia }