import React from "react";
import axios from "axios";
import {rootUrl} from "../base.routes";
import {useParams} from "react-router-dom";
import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import CSS from "csstype";
import LogInNavBar from "./LogInNavBar";

const UserProfile = () => {
    const [authId, setAuthId] = React.useState('');
    const [fName, setfName] = React.useState('');
    const [lName, setlName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [userImage, setUserImage] = React.useState("");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem('userId');
    React.useEffect(()=> {
        const getUser = () => {
            axios.get('http://localhost:4941' + rootUrl + "/users/" + userId, {
                headers: {
                    "X-Authorization": token
                },
                timeout: 10000
            })
                .then((response) => {
                    setfName(response.data.firstName);
                    setlName(response.data.lastName);
                    if (response.data.email) {
                        setEmail(response.data.email);
                    }
                })
        }
        getUser();
    },[userId])
    React.useEffect(()=> {
        axios.get('http://localhost:4941' + rootUrl + '/users/' + userId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setUserImage(imgUrl);
            }).catch((error) => {
                console.log(userImage)
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 404) {
                    console.error("Failed to load image", error);
                }
            }
        });

    }, [userId]);
    const cardInformationStyles: CSS.Properties = {
        display: "inline-block",
        height: "1000px",
        width: "800px",
        margin: "10px",
        padding: "0px"
    }
    return(
        <>
            <LogInNavBar/>
            <Card sx={cardInformationStyles}>
                <CardContent>
                    <Stack direction="row" spacing={2} sx={{
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}>
                        <Typography variant="h5" align="left">
                            {email && (
                                <>
                                    Email: {email}
                                    <br />
                                </>
                            )}
                            First Name: {fName}
                            <br/>
                            Last Name: {lName}
                        </Typography>
                        <div>
                            <Avatar alt="User Image"
                                    sx={{ width: 120, height: 120 }}
                                    src={userImage.length !== 0 ? userImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                        </div>
                    </Stack>
                </CardContent>
            </Card>
        </>
    )
}
export default UserProfile;