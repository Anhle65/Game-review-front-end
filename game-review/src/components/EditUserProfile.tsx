import React, {useState} from "react";
import {useUserStore} from "../store";
import {Card, CardContent} from "@mui/material";
import {CardTitle} from "react-bootstrap";
import LogInNavBar from "./LogInNavBar";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import {rootUrl} from "../base.routes";
import {useNavigate} from "react-router-dom";

const EditUserProfile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = React.useState('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const authorization = useUserStore();
    const token = authorization.token;
    const userId = authorization.userId;
    const navigate = useNavigate();
    const formData = new FormData();
    const onSubmit = async () => {
        console.log("Image file object: ",imageFile);
        console.log("Image file type: ", imageFile?.type);
        console.log(formData);
        await axios.put("http://localhost:4941" + rootUrl + '/users/' + userId + '/image',
            imageFile,
            { headers: {
                    "X-Authorization": token,
                    "Content-Type": imageFile?.type,
                }
            })
        navigate('/users/' + userId + '/profile');
    }
    return (
        <>
            <LogInNavBar/>
            <Card>
                <CardTitle>Edit profile</CardTitle>
                <CardContent>
                    <input type="file" accept="image/png, image/jpeg, image/gif" onChange={(e) => {
                        if (e.target.files) {
                            setImage(URL.createObjectURL(e.target.files[0]));
                            setImageFile(e.target.files[0]);
                        }
                    }}/>
                    <Avatar alt="User Image" sx={{ width: 100, height: 100 }} src={image.length !== 0 ? image : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                    <button type="button" className="btn btn-success" onClick={(e) => {
                        e.preventDefault(); // Prevent form from refreshing the page
                        onSubmit();
                    }}>Update account
                    </button>
                </CardContent>
            </Card>
        </>
    )

}
export default EditUserProfile;