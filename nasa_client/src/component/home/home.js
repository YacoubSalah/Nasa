import React, { useState, useEffect } from "react"
import { Card, CardMedia, CardHeader, CardContent, Typography } from '@mui/material'
import axios from 'axios'
import './home.css'
import serverLinks from "../../serverLinks"

function Home() {

    const [nasaToday, setNasaToday] = useState()


    useEffect(() => getNasaDaily(), [])

    function getNasaDaily() {
        axios.get(serverLinks.nasaToday)
            .then((res) => setNasaToday(res.data))
            .catch(() => setNasaToday("failed"))
    }

    let toRender = () => {
        if (nasaToday === undefined) {
            return "Getting Data..."
        } else {
            if (nasaToday === "failed") {
                return "Failed to get data"
            } else {
                return (
                    <>
                        <CardHeader
                            className="title"
                            title={nasaToday.title}
                        />

                        <CardMedia
                            className="media"
                            component="img"
                            image={nasaToday.media}
                            alt={nasaToday.media}
                            sx={{
                                objectFit: "contain"
                            }}
                        />

                        <CardContent className="description">
                            <Typography>
                                {nasaToday.description}
                            </Typography>
                        </CardContent>

                    </>
                )
            }
        }
    }

    return (
        <Card className="container" >
            {toRender()}
        </Card >
    )

}

export default Home