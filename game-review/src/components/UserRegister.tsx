import React, { useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import axios from "axios";
import {rootUrl} from "../base.routes";
import CSS from "csstype";
import {Alert} from "react-bootstrap";
import {
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import LogoutNavBar from "./LogoutNavBar";
import {useUserStore} from "../store";
import LogInNavBar from "./LogInNavBar";
import Avatar from "@mui/material/Avatar";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';

const UserRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [error, setError] = useState('');
    const [errorFlag, setErrorFlag] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    const [image, setImage] = React.useState('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const authorization = useUserStore();
    const token = authorization.token;
    const userId = authorization.userId;
    const navigate = useNavigate();
    const formData = new FormData();
    const updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
        setError('');
        setErrorFlag(false);
    }

    const updateFnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFname(event.target.value.trim())
        setError('');
        setErrorFlag(false);
    }
    const updateLnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLname(event.target.value.trim())
        setError('');
        setErrorFlag(false);
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowCfPassword = () => setShowCfPassword((show) => !show);
    const updatePasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
        setError('');
        setErrorFlag(false);
    }
    const updateConfirmPasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value)
        setError('');
        setErrorFlag(false);
    }
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = async () => {
        setErrorFlag(false);
        setError('');
        console.log("mage data: ",imageFile);
        if (!token) {
            try {
                if (password !== confirmPassword) {
                    setErrorFlag(true);
                    setError('Password and confirm password is not matched');
                } else {
                    await axios.post("http://localhost:4941" + rootUrl + '/users/register', {
                        firstName: fname,
                        lastName: lname,
                        email: email,
                        password: password
                    }, {
                        timeout: 10000
                    });
                    setErrorFlag(false);
                    setError('');
                    console.log(email);
                    console.log('fname' + fname);
                    console.log('lname' + lname);

                    const response = await axios.post("http://localhost:4941" + rootUrl + '/users/login', {
                        email: email,
                        password: password
                    }, {
                        timeout: 10000
                    });
                    const {userId, token} = response.data;
                    authorization.setAuthorization(userId, token);
                    console.log("userId:", userId);
                    console.log("token:", token);
                    if (imageFile) {
                        await axios.put("http://localhost:4941" + rootUrl + '/users/' + userId + '/image',
                            imageFile,
                            {
                                headers: {
                                    "X-Authorization": token,
                                    "Content-Type": imageFile?.type,
                                }
                            })
                    }
                    navigate('/games/');
                }
            } catch (error: any) {
                console.log(error);
                console.log('fname:' + fname);
                console.log('lname:' + lname);
                console.log(email);
                console.log(password);
                setErrorFlag(true);
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        if (fname.length < 1) {
                            setError("Fist name can not be null");
                        } else {
                            if (lname.length < 1) {
                                setError("Last name can not be null");
                            } else {
                                if (password.length < 6 || password.length > 64) {
                                    setError("Password length must be from 6 to 64 characters");
                                } else {
                                    setError("Invalid email");
                                }
                            }
                        }
                    } else {
                        if (error.response?.status === 403) {
                            setError("Email is already used");
                        } else
                            setError(error.toString());
                    }
                } else {
                    setError("Unexpected error");
                }
            }
        } else {
            setErrorFlag(true);
            setError('You need to logout first to register');
        }
    };
    const signUpCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "800px",
        width: "500px",
        margin: "10px",
        padding: "0px",
        backgroundColor: "lightcyan",
    }
    return (
        <>{(userId && token) && (
            <>
                <LogInNavBar />
            </>
        )}
            {(!userId || !token)  && (
                <>
                    <LogoutNavBar />
                </>
            )}
            <div className="signup-form-container">
                <h2 className="signup-title">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card sx={signUpCardStyles}>
                    <CardContent>
                        <form>
                            <Stack direction="column" spacing={2} sx={{
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}>
                                <TextField
                                    required
                                    id="first-name-required"
                                    label="First name"
                                    onChange={updateFnameState}
                                />
                                <TextField
                                    required
                                    id="last-name-required"
                                    // defaultValue="Smith"
                                    onChange={updateLnameState}
                                    label="Last name"
                                />
                                <TextField
                                    required
                                    type="text"
                                    id="email-required"
                                    label="Email"
                                    onChange={updateEmailState}
                                />
                                    <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={updatePasswordState}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    </FormControl>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-cornfirmpassword" >Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-cornfirmpassword"
                                        type={showCfPassword ? 'text' : 'password'}
                                        onChange={updateConfirmPasswordState}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showCfPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={handleClickShowCfPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showCfPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirm Password"
                                    />
                                </FormControl>
                                <label>Upload image: </label>
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
                                }}>Create account
                                </button>
                                <Typography variant="subtitle2" align="center">
                                    Already had account?
                                    <NavLink to={'/users/login'} end>
                                        Login
                                    </NavLink>
                                </Typography>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
export default UserRegister;