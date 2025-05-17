import React, { useState } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import {
    Card,
    CardActions,
    FormControl,
    CardContent,
    IconButton,
    InputAdornment, InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CSS from "csstype";
import {rootUrl} from "../base.routes";
import {NavLink, useNavigate} from "react-router-dom";
import axios from "axios";
import LogoutNavBar from "./LogoutNavBar";
import {useUserStore} from "../store";
import LogInNavBar from "./LogInNavBar";
import {Visibility, VisibilityOff} from "@mui/icons-material";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorFlag, setErrorFlag] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const authorization = useUserStore();
    const token = authorization.token;
    const userId = authorization.userId;

    const updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
        setError('');
        setErrorFlag(false);
    }
    const updatePasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
        setError('');
        setErrorFlag(false);
    }
    const handleShowPassword = () => setShowPassword((show) => !show)
    const onSubmit = async () => {
        if (!token) {
            if(!email) {
                setError("Please enter email");
                return;
            }
            try {
                const response = await
                    axios.post("http://localhost:4941" + rootUrl + '/users/login', {
                        email: email,
                        password: password
                    }, {
                        timeout: 10000
                    });
                setErrorFlag(false);
                setError('');
                const {userId, token} = response.data;
                authorization.setAuthorization(userId, token);
                console.log(userId);
                navigate('/games/user/' + userId);
            } catch (error: any) {
                console.log(error);
                console.log(email);
                console.log(password);
                setErrorFlag(true);
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        if (password.length < 6 || password.length > 64) {
                            setError("Password length must be from 6 to 64 characters");
                        } else
                            setError("Invalid email");
                    } else {
                        if (error.response?.status === 401) {
                            setError("Wrong email or password");
                        } else
                            setError("Failed to login");
                    }
                } else {
                    setError("Unexpected error");
                }
            }
        } else {
            setErrorFlag(true);
            setError('You need to logout first to login again');
        }
    };
    const loginCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "500px",
        width: "300px",
        margin: "10px",
        padding: "0px",
        justifyContent: "center",
        alignItems: "center"
        // backgroundColor: "lightcyan",
    }
    return (
        <>
            {(userId && token) && (
                <>
                    <LogInNavBar />
                </>
            )}
            {(!userId || !token)  && (
                <>
                    <LogoutNavBar />
                </>
            )}
                <h2 className="login-title">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card sx={loginCardStyles}>
                    <CardContent sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Stack direction="column" spacing={2} sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <TextField
                                fullWidth
                                required
                                type='email'
                                id="email-required"
                                label="Email"
                                onChange={updateEmailState}
                            />
                            <FormControl variant="outlined" fullWidth>
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
                                                onClick={handleShowPassword}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onMouseUp={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <button type="button" className="btn btn-success" onClick={(e) => {
                                e.preventDefault(); // Prevent form from refreshing the page
                                onSubmit();
                            }}>Log In
                            </button>
                            <Typography variant="subtitle2" align="center">
                                No account yet?
                                <NavLink to={'/users/register'} end>
                                    Register
                                </NavLink>
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
        </>
    );
}


export default Login;
