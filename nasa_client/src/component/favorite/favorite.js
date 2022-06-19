import React from "react"
import './favorite.css'
import Post from "../post/post"
import {Grid} from '@mui/material'

function favorite(props) {

    function renderPosts() {
        if (props.savedPosts.length === 0) {
            return "No posts to display"
        } else {
            return props.savedPosts.map(l => <Post
                post={l}
                key={l.nasa_id}
                savePost={props.savePost}
                unsavePost={props.unsavePost}
            />)
        }
    }

    return (
        <div>
            <Grid container gap={2} className="postsContainer">
                {renderPosts()}
            </Grid>
        </div>
    )
}

export default favorite