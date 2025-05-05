import React from "react";
import CSS from "csstype";
import {Avatar, Card, CardContent, CardMedia, Stack, Typography} from "@mui/material";
import {rootUrl} from "../base.routes";
import axios from "axios";

interface IGameReviewProps {
    gameReview: Review
}
const GameReviewObject = (props: IGameReviewProps) => {
    const [gameReview] = React.useState<Review> (props.gameReview);
    const [reviewerImage, setReviewerImage] = React.useState("");
    const gameReviewCardStyles: CSS.Properties = {
        display: "inline-block",
        overflowY: "auto",
        height: "200px",
        width: "250px",
        margin: "10px",
        padding: "0px"
    }
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/users/' + gameReview.reviewerId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setReviewerImage(imgUrl);
            }).catch((error) => {

                if (axios.isAxiosError(error)) {
                    if (error.response?.status !== 404) {
                        console.error("Failed to load image", error);
                    }
                } else {
                    setReviewerImage('');
                }
            })
    }, [])
    return(
        <Card sx={gameReviewCardStyles}>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography variant="h6" component="div" align="left">
                        {gameReview.reviewerFirstName} {gameReview.reviewerLastName}
                        <br/>
                        <Typography variant="subtitle2" align="left">
                            Rating: {gameReview.rating}/10
                            <br/>
                            Messages: {gameReview.review}
                            <br/>
                            Rated on: {gameReview.timestamp}
                        </Typography>
                    </Typography>
                    <div>
                        <Avatar alt="Creator Image" src={reviewerImage.length !== 0 ? reviewerImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                    </div>
                </Stack>
            </CardContent>
        </Card>
    )
}
export default GameReviewObject;