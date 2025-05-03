import React from "react";
import axios from "axios";
import {rootUrl} from "../base.routes";
import {useParams} from "react-router-dom";
import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import CSS from "csstype";

const UserProfile = () => {
    const {id} = useParams();
    const [authId, setAuthId] = React.useState('');
    const [fName, setfName] = React.useState('');
    const [lName, setlName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [userImage, setUserImage] = React.useState("");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem('userId');
    React.useEffect(()=> {
        if (userId) {
            setAuthId(userId);
        }
        const getUser = () => {
            axios.get('http://localhost:4941' + rootUrl + "/users/" + id, {
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
    },[id])
    React.useEffect(()=> {
        axios.get('http://localhost:4941' + rootUrl + '/users/' + id + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setUserImage(imgUrl);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });

    }, []);
    const cardInformationStyles: CSS.Properties = {
        display: "inline-block",
        height: "1000px",
        width: "800px",
        margin: "10px",
        padding: "0px"
    }
    return(
        <><h1>Profile</h1>
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