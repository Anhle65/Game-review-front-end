import React from "react";
import CSS from "csstype";
import {Avatar, Card, CardContent, CardMedia, Stack, TextField, Typography} from "@mui/material";
import {rootUrl} from "../../base.routes";
import axios from "axios";

interface IGameReviewProps {
    gameReview: Review
}
const GameReviewObject = (props: IGameReviewProps) => {
    const [gameReview] = React.useState<Review> (props.gameReview);
    // const [reviewerImage, setReviewerImage] = React.useState("");
    const gameReviewCardStyles: CSS.Properties = {
        display: "inline-block",
        overflowY: "auto",
        height: "250px",
        width: "270px",
        margin: "10px",
        padding: "0px"
    }
    // React.useEffect(()=> {
    //     axios.get('http://localhost:4941'+rootUrl+'/users/' + gameReview.reviewerId + '/image', {
    //         responseType: 'blob',
    //     })
    //         .then((response) => {
    //             if(response.data) {
    //                 const imgUrl = URL.createObjectURL(response.data);
    //                 console.log("Should not create URL");
    //                 setReviewerImage(imgUrl);
    //             }
    //         }).catch((error) => {
    //             setReviewerImage('');
    //             if (axios.isAxiosError(error)) {
    //                 if (error.response?.status !== 404) {
    //                     console.error("Failed to load image", error);
    //                 }
    //         }})
    // }, [])
    return(
        <Card sx={gameReviewCardStyles}>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography sx={{display:'flex', justifyContent:'flext-start'}} variant="h6" component="div" align="left">
                        {gameReview.reviewerFirstName} {gameReview.reviewerLastName}
                    </Typography>
                        <div>
                            <Avatar alt="Creator Image" src={`http://localhost:4941${rootUrl}/users/${gameReview.reviewerId}/image`} />
                        </div>
                </Stack>
                <TextField
                    fullWidth
                    multiline={true}
                    rows={3}
                    variant='standard'
                    type="text"
                    label="Comment:"
                    value={gameReview.review}
                    inputProps={{
                        readOnly: true
                    }}
                    sx={{my: 2, overflowY: 'auto', display:'flex'}}
                />
                    <Typography variant="subtitle2" align="left">
                        Rating: {gameReview.rating}/10
                        <br/>
                        Rated on: {new Date(gameReview.timestamp).toLocaleDateString()}
                    </Typography>
            </CardContent>
        </Card>
    )
}
export default GameReviewObject;