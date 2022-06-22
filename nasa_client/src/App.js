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
  const [isLibraryPostsMediaReady, setIsLibraryPostsMediaReady] = useState(true)

  useEffect(function () {
    getSavedPosts()
  }, [])

  useEffect(function () {
    if (!isLibraryPostsMediaReady) {
      getLibraryPostsMedia()
    }
  }, [libraryPosts])


  function getSavedPosts() {
    let link = serverLinks.savedPosts
    axios.get(link)
      .then((res) => {
        setSavedPosts(res.data)

      })
      .catch((err) => {
        setSavedPosts([])
      })
  }

  function getLibraryPostsMedia() {
    setIsLibraryPostsMediaReady(true)
    let tempSavedPosts = [...libraryPosts]
    tempSavedPosts.forEach(async (tempSavedPost) => {
      if (tempSavedPost.mediaReady === undefined || tempSavedPost.mediaReady === false) {
        getPostMedia(tempSavedPost, tempSavedPosts)
      }
    })

  }

  function getPostMedia(tempSavedPost, tempSavedPosts) {
    let media = ""
    axios.get(tempSavedPost.media)
      .then((mediaList) => {


        let thumbnail = filterMedia(mediaList.data)
        if (thumbnail) {
          tempSavedPost.thumbnail = thumbnail
          tempSavedPost.mediaReady = true
        } else {
          console.log(tempSavedPost.title);
          console.log(tempSavedPost.media);
          tempSavedPost.mediaReady = false
        }
        setLibraryPosts(tempSavedPosts)


      })
      .catch()
    return media
  }

  function filterMedia(media) {
    if (media) {
      let thumbnail = ""
      for (let m of media) {
        if (m.includes("thumb.jpg")) {
          thumbnail = m
          break
        }
      }
      if (thumbnail) {
        return thumbnail
      }
    }
    return false
  }

  function getLibraryPosts(searchWord) {
    let link = serverLinks.nasaLibrary + searchWord
    axios.get(link)
      .then((libraryPostsResponse) => {
        let syncedLibrarayPosts = syncLibraryWithSaved(libraryPostsResponse.data)
        setLibraryPosts(syncedLibrarayPosts)
        setIsLibraryPostsMediaReady(false)
      })
      .catch((err) => {
        setLibraryPosts([])
      })
  }

  function syncLibraryWithSaved(UnsyncedLibrarayPosts) {
    let tempUnsyncedlibrarayPosts = [...UnsyncedLibrarayPosts]
    for (let tempUnsyncedLibraryPost of tempUnsyncedlibrarayPosts) {
      for (let savedPost of savedPosts) {
        if (areTheSamePost(tempUnsyncedLibraryPost, savedPost)) {
          tempUnsyncedLibraryPost.saved = savedPost.saved
          break;
        }
      }
    }
    return tempUnsyncedlibrarayPosts
  }

  function areTheSamePost(post1, post2) {
    if (post1.nasa_id === post2.nasa_id) {
      return true
    }
    return false
  }

  function savePost(post) {
    let tempSavedPosts = [...savedPosts]
    let tempSavedPost = tempSavedPosts.find(t => t.nasa_id === post.nasa_id)
    if (tempSavedPost) {
      tempSavedPost.saved = true
    } else {
      post.saved = true
      tempSavedPosts.push(post)
    }
    if (libraryPosts.length) {
      let syncedlibraryPosts = syncLibraryWithSaved(libraryPosts)
      setLibraryPosts(syncedlibraryPosts)
    }
    setSavedPosts(tempSavedPosts)
    updateSavedPostToDB()
  }

  function unsavePost(post) {
    let tempSavedPosts = [...savedPosts]
    let tempSavedPost = tempSavedPosts.find(t => t.nasa_id === post.nasa_id)
    tempSavedPost.saved = false
    if (libraryPosts.length) {
      let syncedLibraryPosts = syncLibraryWithSaved(libraryPosts)
      setLibraryPosts(syncedLibraryPosts)
    }
    setSavedPosts(tempSavedPosts)
    updateSavedPostToDB()
  }

  function updateSavedPostToDB() {
    let postsToSave = savedPosts.filter(p => p.saved === true)
    axios.put(serverLinks.savedPosts, postsToSave)
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
