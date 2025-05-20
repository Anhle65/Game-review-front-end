import React, {useState} from "react";
import {useUserStore} from "../../store";
import {
    Button,
    Card,
    CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel, ListItemIcon,
    OutlinedInput,
    Box,
    TextField, Tooltip, Stack
} from "@mui/material";
import {Alert, CardTitle} from "react-bootstrap";
import LogInNavBar from "../LogInNavBar";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import axios from "axios";
import {rootUrl} from "../../base.routes";
import {useNavigate} from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import CSS from "csstype";
import IconButton from "@mui/material/IconButton";
import {Edit, Visibility, VisibilityOff} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
const EditUserProfile = () => {
    const [email, setEmail] = useState("");
    const [originEmail, setOriginEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [editPasswordState, setEditPasswordState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = React.useState('');
    const [originImage, setOriginImage] = React.useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    const [isRevertImage, setIsRevertImage] = useState(false);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const authorization = useUserStore();
    const token = authorization.token;
    const userId = authorization.userId;
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditMessage, setOpenEditMessage] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const onSubmit = async () => {
        console.log('email: ', email);
        console.log('current password: ', currentPassword);
        console.log('password: ', password);
        console.log('cfpassword: ', confirmPassword);
        if (firstName.length < 1) {
            setErrorFlag(true);
            setErrorMsg("Fist name can not be null");
            return;
        }
        if (lastName.length < 1) {
            setErrorFlag(true);
            setErrorMsg("Last name can not be null");
            return;
        }
        const data:Record<string, string> = {'firstName': firstName,
            'lastName': lastName}
        if(email !== originEmail)
            data["email"] = email;
        if(editPasswordState) {
            if(!password && !currentPassword) {
                window.scrollTo({top:0});
                setErrorFlag(true);
                setErrorMsg("New password and current password can't be null");
                return;
            } else {
                if (password.length < 6 || password.length > 64 || currentPassword.length < 6 || currentPassword.length > 64) {
                    setErrorFlag(true);
                    setErrorMsg("All password length must be from 6 to 64 characters");
                    return;
                }
                if(password !== confirmPassword) {
                    window.scrollTo({top:0});
                    setErrorFlag(true);
                    setErrorMsg("New password must match with confirm password");
                    return;
                }
                setErrorFlag(false);
                data["password"] = password;
                data["currentPassword"] = currentPassword;
            }
        }
        if(!errorFlag) {
            try {
                if (imageFile) {
                    await axios.put("http://localhost:4941" + rootUrl + '/users/' + userId + '/image',
                        imageFile,
                        {
                            headers: {
                                "X-Authorization": token,
                                "Content-Type": imageFile?.type,
                            }
                        })
                } else {
                    if(!image) {
                        await axios.delete("http://localhost:4941" + rootUrl + '/users/' + userId + '/image', {
                            headers: {
                                "X-Authorization": token,
                            }
                        })
                    }
                }
                await axios.patch("http://localhost:4941" + rootUrl + '/users/' + userId,
                    data,
                    {
                        headers: {
                            "X-Authorization": token,
                        }
                    })
                navigate('/users/' + userId + '/profile');
            } catch (error) {
                setErrorFlag(true);
                if (axios.isAxiosError(error)) {
                    window.scrollTo({top:0});
                    if (error.response?.status === 400) {
                        setErrorMsg("Invalid email");
                    } else {
                        if (error.response?.status === 403) {
                            const statusText = error.response.statusText;
                            if (statusText.includes("Email already in use")) {
                                setErrorMsg("This email is already used.");
                            } else {
                                setErrorMsg("New password can not be the same as old password");
                            }
                        } else {
                            if(error.response?.status === 401) {
                                setErrorMsg("Incorrect current password");
                            } else {
                                setErrorMsg("Internal error");
                            }
                        }
                    }
                } else {
                    setErrorMsg("Unexpected error");
                }
            }
        } else {
            setErrorMsg("Unable to update profile");
        }
    }
    const updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
        setErrorMsg('');
        setErrorFlag(false);
    }

    const updateFnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value.trim())
        setErrorMsg('');
        setErrorFlag(false);
    }
    const updateLnameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value.trim())
        setErrorMsg('');
        setErrorFlag(false);
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowCurrentPassword = () => setShowCurrentPassword((show) => !show);
    const handleClickShowCfPassword = () => setShowCfPassword((show) => !show);
    const updatePasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
        setErrorMsg('');
        setErrorFlag(false);
    }
    const updateCurrentPasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(event.target.value)
        setErrorMsg('');
        setErrorFlag(false);
    }
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    }
    const updateConfirmPasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value)
        setErrorMsg('');
        setErrorFlag(false);
    }
    React.useEffect(() => {
        axios.get('http://localhost:4941'+rootUrl+'/users/'+userId, {
            headers: {
                "X-Authorization": token
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMsg('');
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                if (response.data.email) {
                    setEmail(response.data.email);
                }
                else {
                    setErrorMsg("You are unauthorized. Can not see other user's email");
                    setErrorFlag(true);
                    return
                }
                console.log("Email from back end: ", response.data.email);
                setOriginEmail(response.data.email);
            })
    }, [])
    React.useEffect(()=> {
        axios.get('http://localhost:4941' + rootUrl + '/users/' + userId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setErrorFlag(false);
                setImage(imgUrl);
                setOriginImage(imgUrl);
            }).catch((error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 404) {
                    setErrorFlag(true);
                    console.error("Failed to load image", error);
                }
            }
        });
    }, []);
    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if(e.target.files[0]) {
                const file = e.target.files[0];
                const fileSizeMB = file.size / (1024 * 1024);
                if(fileSizeMB >= 5) {
                    setErrorFlag(true);
                    setErrorMsg('Image size can not exceed 5MB');
                    window.scrollTo({top:0});
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    return;
                }
                setErrorFlag(false);
                setErrorMsg('');
                setImage(URL.createObjectURL(e.target.files[0]));
                setImageFile(e.target.files[0]);
            }
        }
    }
    const handleRevertOriginImage = () => {
        setImage(originImage);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    const handleRemoveImage = () => {
        setImage("");
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    const editCardStyles: CSS.Properties = {
        display: "inline-block",
        minHeight: "800px",
        width: "70%",
        margin: "10px",
        padding: "0px",
    }
    return (
        <>
            <LogInNavBar/>
            <Card sx={editCardStyles}>
                <CardTitle>Edit profile</CardTitle>
                <CardContent>
                    {errorFlag && <Alert variant="danger">{errorMsg}</Alert>}
                    <Grid container rowSpacing={2} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid size={6}>
                            <FormControl fullWidth sx={{my: 2}} variant="outlined">
                                <TextField
                                    required
                                    type="text"
                                    id="first-name-required"
                                    label="First Name"
                                    onChange={updateFnameState}
                                    value={firstName}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                    fullWidth
                                    sx={{my: 2}}
                                />
                                <TextField
                                    type="text"
                                    required
                                    id="last-name-required"
                                    label="Last Name"
                                    value={lastName}
                                    onChange={updateLnameState}
                                    sx={{my: 2}}
                                    fullWidth
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    required
                                    id="email-required"
                                    rows={8}
                                    label="Email"
                                    value={email}
                                    onChange={updateEmailState}
                                    sx={{my: 2}}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
                            </FormControl>
                            <Box sx={{flexGrow: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                    <Grid size={6} sx={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                            <FormControl variant="outlined">
                                <InputLabel required={editPasswordState} htmlFor="outlined-adornment-current-password">Current Password</InputLabel>
                                <ListItemIcon>
                                <OutlinedInput
                                    fullWidth
                                    required
                                    disabled={!editPasswordState}
                                    id="outlined-adornment-current-password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    onChange={updateCurrentPasswordState}
                                    value={currentPassword}
                                    sx={{display:'flex'}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {editPasswordState && (
                                            <IconButton
                                                aria-label={
                                                    showCurrentPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowCurrentPassword}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onMouseUp={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>)}
                                        </InputAdornment>
                                    }
                                    label="Current password"
                                />
                                    <Tooltip open={openEditMessage} onClose={()=>setOpenEditMessage(false)} onOpen={()=>setOpenEditMessage(true)}
                                        title={editPasswordState? 'Click to keep old password':'Click to update password'}>
                                        <span>
                                        {editPasswordState && (<EditIcon fontSize="large" onClick={()=>setEditPasswordState(false)}/>)}
                                        {!editPasswordState && (<EditOffIcon fontSize="large" onClick={()=>{setEditPasswordState(true)
                                            setCurrentPassword('');
                                            setConfirmPassword('');
                                            setPassword('');
                                        }}/>)}
                                        </span>
                                    </Tooltip>
                                </ListItemIcon>
                            </FormControl>
                                    </Grid>
                                    <br/>
                                    {editPasswordState && (
                                        <Grid size={12} sx={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                                    <FormControl variant="outlined" style={{padding: '20px 0 0 0'}}>
                                        <InputLabel required={editPasswordState} style={{padding: '20px 0 0 0'}} htmlFor="outlined-adornment-newpassword">New Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-newpassword"
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={updatePasswordState}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onMouseUp={(e) => e.preventDefault()}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="New Password"
                                        />
                                    </FormControl>
                                            <br/>
                                            <FormControl variant="outlined" style={{padding: '20px 0 0 0'}}>
                                                <InputLabel required={editPasswordState} style={{padding: '20px 0 0 0'}} htmlFor="outlined-adornment-cornfirmpassword">Confirm Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-cornfirmpassword"
                                                    fullWidth
                                                    type={showCfPassword ? 'text' : 'password'}
                                                    onChange={updateConfirmPasswordState}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={
                                                                    showCfPassword ? 'hide the password' : 'display the password'
                                                                }
                                                                onClick={handleClickShowCfPassword}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                onMouseUp={(e) => e.preventDefault()}
                                                                edge="end"
                                                            >
                                                                {showCfPassword ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Confirm Password"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid size={6} sx={{justifyContent: 'left', alignItems: 'left'}}>
                            <input type="file" ref={fileInputRef} accept="image/png, image/jpeg, image/jpg, image/gif" onChange={(e) => {
                                handleUploadImage(e);
                            }}/>
                            <Tooltip title={'Remove image'}>
                                <CloseIcon fontSize='large' onClick={() => {
                                    setIsRevertImage(false);
                                    setOpenDeleteDialog(true)
                                }}/>
                            </Tooltip>
                            <Tooltip title={'Revert origin image'}>
                                <SettingsBackupRestoreIcon fontSize='large' onClick={() => {
                                    setIsRevertImage(true);
                                    setOpenDeleteDialog(true);
                                }}/>
                            </Tooltip>
                            <br/>
                            <CardMedia
                                component="img"
                                sx={{objectFit: "cover"}}
                                image={image.length > 0 ? image : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                            />
                        </Grid>
                    </Grid>
                    <button type="button" className="btn btn-success" onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}>Update account
                    </button>
                </CardContent>
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {isRevertImage? "Revert back to original image?":"Remove image?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {isRevertImage? 'Are you sure you want to revert back to original image':'Are you sure you want to remove image?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            if(!isRevertImage) handleRemoveImage();
                            else {handleRevertOriginImage();
                            console.log("revert image should be true", isRevertImage);}
                            setOpenDeleteDialog(false);
                        }} autoFocus>
                            {isRevertImage? 'Revert':'Remove'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </>
    )

}
export default EditUserProfile;