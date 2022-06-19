import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import axios from 'axios';
import serverLinks from './serverLinks';
import Home from './component/home/home'
import Search from './component/search/search'
import Favorite from './component/favorite/favorite';
import './App.css';

function App() {
  const [libraryPosts, setLibraryPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [libraryPostsSaveStatus, setlibraryPostsSaveStatus] = useState()
  const [savedPostsIds, setsavedPostsIds] = useState()
  const [doesSavedPostsNeedBack, setdoesSavedPostsNeedBack] = useState(false)

  useEffect(function () {
    if (doesSavedPostsNeedBack) {
      updateSavedPostToDB()
    }
  }, [doesSavedPostsNeedBack])

  useEffect(function () {
    getSavedPosts()
  }, [])

  useEffect(() => {
    if (libraryPosts.length && Object.keys(libraryPostsSaveStatus).length) {
      updateLibraryForNewSaves()
    }
  }, [savedPosts, libraryPosts])

  function updateLibraryForNewSaves() {
    let tempLibraryPost = [...libraryPosts]
    let templibraryPostsSaveStatus = { ...libraryPostsSaveStatus }
    let isTempLibraryPostModified = false
    for (let post of savedPosts) {
      let x = templibraryPostsSaveStatus[post.nasa_id]
      if ((x === true || x === false) && x !== post.saved) {
        let Tpost = tempLibraryPost.find((p) => p.nasa_id === post.nasa_id)
        Tpost.saved = !Tpost.saved
        templibraryPostsSaveStatus[post.nasa_id] = !templibraryPostsSaveStatus[post.nasa_id]
        isTempLibraryPostModified = true
      }
    }
    if (isTempLibraryPostModified) {
      setLibraryPosts(tempLibraryPost)
      setlibraryPostsSaveStatus(templibraryPostsSaveStatus)
    }
  }

  function getSavedPosts() {
    let link = serverLinks.savedPosts
    axios.get(link)
      .then((res) => {
        setSavedPosts(res.data)
        generatedSavedPostsIds(res.data)
      })
      .catch((err) => {
        setSavedPosts([])
      })
  }

  function generatedSavedPostsIds(posts) {
    let savedPostsIds = new Set()
    for (let post of posts) {
      savedPostsIds.add(post.nasa_id)
    }
    setsavedPostsIds(savedPostsIds)
  }

  function getLibraryPosts(searchWord) {
    let link = serverLinks.nasaLibrary + searchWord
    axios.get(link)
      .then((libraryPosts) => {
        setLibraryPosts(libraryPosts.data)
        generateLibraryPostsSaveStatus(libraryPosts.data)
      })
      .catch((err) => {
        setLibraryPosts([])
      })
  }

  function generateLibraryPostsSaveStatus(posts) {
    let libraryPostsSaveStatus = {}
    for (let post of posts) {
      libraryPostsSaveStatus[post.nasa_id] = false
    }
    setlibraryPostsSaveStatus(libraryPostsSaveStatus)
  }

  function savePost(post) {
    let postNasaId = post.nasa_id
    let tempSavedPost = [...savedPosts]
    if (savedPostsIds.has(postNasaId)) {
      for (let postIndex in tempSavedPost) {
        if (tempSavedPost[postIndex].nasa_id == postNasaId) {
          tempSavedPost[postIndex].saved = true
          break;
        }
      }
    } else {
      let tempSavedPostIds = savedPostsIds
      tempSavedPostIds.add(postNasaId)
      setsavedPostsIds(tempSavedPostIds)
      tempSavedPost.push(post)
    }
    setSavedPosts(tempSavedPost)
  }

  function unsavePost(post) {
    let postNasaId = post.nasa_id
    let tempSavedPost = [...savedPosts]
    for (let postIndex in tempSavedPost) {
      if (tempSavedPost[postIndex].nasa_id == postNasaId) {
        tempSavedPost[postIndex].saved = false
        break;
      }
    }
    setSavedPosts(tempSavedPost)
  }

  function updateSavedPostToDB() {
    let postsToSave = savedPosts.filter(p => p.saved == true)
    axios.put(serverLinks.savedPosts, postsToSave)
  }

  function getPostMedia(post) {

  }

  return (
    <div>
      <Router>
        <div className='navigationMenu'>
          <Link className='link' to="/">Home</Link>
          <Link className='link' to="/search">Search</Link>
          <Link className='link' to="/favorite">Favorite</Link>
        </div>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/search"
            element={<Search
              getLibraryPosts={getLibraryPosts}
              libraryPosts={libraryPosts}
              savePost={savePost}
              unsavePost={unsavePost}
            />}></Route>
          <Route exact path="/favorite"
            element={<Favorite
              savedPosts={savedPosts}
              savePost={savePost}
              unsavePost={unsavePost}
            />}>
          </Route>
        </Routes>
      </Router>
    </div>

  )
}

export default App;
