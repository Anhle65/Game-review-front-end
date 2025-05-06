import {useState} from "react";
import {useUserStore} from "../store";
import {Card, CardContent} from "@mui/material";
import {CardTitle} from "react-bootstrap";

const EditUserProfile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const authorization = useUserStore();
    const token = authorization.token;
    const userId = authorization.userId;
    return (
        <Card>
            <CardTitle>Edit profile</CardTitle>
            <CardContent>

            </CardContent>
        </Card>
    )

}
export default EditUserProfile;