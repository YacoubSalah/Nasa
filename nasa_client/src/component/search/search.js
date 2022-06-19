import React, { useState } from "react"
import { Button, Card, TextField , Grid} from '@mui/material'
import Post from "../post/post"
import './search.css'

function Search(props) {

    const [searchWord, setSearchWord] = useState("")

    function bindSearchToState(event) {
        let value = event.target.value
        setSearchWord(value)
    }

    function getLibraryPosts() {
        props.getLibraryPosts(searchWord)
    }

    function renderPosts() {
        if (props.libraryPosts.length === 0) {
            return "No posts to display"
        } else {
            return props.libraryPosts.map(l => <Post
                post={l}
                key={l.nasa_id}
                savePost={props.savePost}
                unsavePost={props.unsavePost}
            />)
        }
    }

    return (
        <Card className="container">
            <div className="searchMenu">
                <TextField
                    className="textField"
                    variant="outlined"
                    name="search"
                    value={searchWord}
                    onChange={bindSearchToState}
                    placeholder="Search NASA Database"
                    sx={{
                        
                    }}
                />
                <Button
                className="button"
                    variant="contained"
                    onClick={getLibraryPosts}
                    name="search">Search
                </Button>
            </div>
            <Grid container gap={2} className="postsContainer">
                {renderPosts()}
            </Grid>
        </Card>

    )

}

export default Search