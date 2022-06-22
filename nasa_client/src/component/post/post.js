import React from "react"
import './post.css'
import { Grid, Button } from '@mui/material'

function Post(props) {

    function savePost() {
        props.savePost(props.post)
    }

    function unsavePost() {
        props.unsavePost(props.post)
    }

    return (
        <Grid item container xs={3.8} className="postContainer">

            <div className="postTitle">{props.post.title}</div>
            {props.post.mediaReady ? <img src={props.post.thumbnail}  alt="" /> : <div className="postMedia">couldn't get media</div>}
            <div className="description">{props.post.description}</div>
            <div className="postButton">
                {props.post.saved ? <Button variant="contained" onClick={unsavePost}>Unsave</Button> : <Button variant="contained" onClick={savePost}>Save</Button>}
            </div>

        </Grid>
    )

}

export default Post