import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {rootUrl} from "../base.routes";
import CSS from "csstype";
import {Alert} from "react-bootstrap";
import {Card, CardContent, Stack} from "@mui/material";

const UserRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [error, setError] = useState('');
    const [errorFlag, setErrorFlag] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pwFormType, setPwFormType] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        setPwFormType(showPassword ? 'text' : 'password');
    }, [ showPassword ]);
    const updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
        setError('');
        setErrorFlag(false);
    }

    const updateFnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFname(event.target.value)
        setError('');
        setErrorFlag(false);
    }
    const updateLnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLname(event.target.value)
        setError('');
        setErrorFlag(false);
    }
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
    const onSubmit = async () => {
        try {
            if(password !== confirmPassword) {
                setErrorFlag(true);
                setError('Password and confirm password is not matched');
            } else {
             await axios.post("http://localhost:4941"+rootUrl + '/users/register', {
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
                console.log('fname'+fname);
                console.log('lname'+lname);

                const response = await axios.post("http://localhost:4941"+rootUrl + '/users/login', {
                    email: email,
                    password: password
                }, {
                    timeout: 10000
                });
                const {userId, token} = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                navigate(rootUrl + '/users/' + userId);
            }
        } catch(error:any) {
            console.log(error);
            console.log('fname:'+fname);
            console.log('lname:'+lname);
            console.log(email);
            console.log(password);
            setErrorFlag(true);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    if(fname.length < 6 || fname.length > 64) {
                        setError("Fist name length must be from 6 to 64 characters");
                    } else {
                        if (lname.length < 6 || lname.length > 64) {
                            setError("Last name length must be from 6 to 64 characters");
                        } else {
                            if(password.length < 6 || password.length > 64) {
                                setError("Password length must be from 6 to 64 characters");
                            } else {
                                setError("Invalid email");
                            }
                        }
                    }
                } else{
                    if (error.response?.status === 403) {
                        setError("Email is already used");
                    } else
                        setError("Internal Server Error");
                }
            } else {
                setError("Unexpected error");
            }
        }
    };
    const signUpCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "600px",
        width: "300px",
        margin: "10px",
        padding: "0px",
        backgroundColor: "lightcyan",
    }
    return (
        <div className="signup-form-container">
            <h2 className="signup-title">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Card sx={signUpCardStyles}>
                <CardContent >
                    <form>
                        <Stack direction="column" spacing={2} sx={{
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}>
                            <div className="signup-form">
                                <label htmlFor="fname">First Name:</label>
                                <input type="text" className="form-control" id="fname" onChange={updateFnameState}/>
                            </div>
                            <div className="signup-form">
                                <label htmlFor="lname">Last Name:</label>
                                <input type="text" className="form-control" id="lname" onChange={updateLnameState}/>
                            </div>
                            <div className="signup-form">
                                <label htmlFor="email">Email address:</label>
                                <input type="email" className="form-control" id="email" onChange={updateEmailState}/>
                            </div>
                            <div className="signup-form">
                                <label htmlFor="pwd">Password:</label>
                                <input type={pwFormType} className="form-control" id="pwd"
                                       onChange={updatePasswordState}/>
                            </div>
                            <div className="signup-form">
                                <label htmlFor="cfpwd">Confirm password:</label>
                                <input type={pwFormType} className="form-control" id="cfpwd"
                                       onChange={updateConfirmPasswordState}/>
                            </div>

                            <div className="checkbox">
                                <label><input type="checkbox" checked={showPassword}
                                              onChange={() => setShowPassword(prev => !prev)}/> Show password</label>
                            </div>
                            <button type="button" className="btn btn-success" onClick={(e) => {
                                e.preventDefault(); // Prevent form from refreshing the page
                                onSubmit();
                            }}>Create account
                            </button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
export default UserRegister;