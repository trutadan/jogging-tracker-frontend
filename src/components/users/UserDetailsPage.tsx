import {Container, CardContent, Button} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import { customAxios } from "../../services/application.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExtendedUser from "../../models/ExtendedUser";

const UserDetailsPage = () => {
    const navigate = useNavigate();

    const { userId } = useParams();
    const [user, setUser] = useState<ExtendedUser>();

    const fetchUser = async () => {
        customAxios()
            .get(`/users/${userId}`)
            .then((response) => {
                const userData: ExtendedUser = response.data;
                setUser(userData);
            })
            .catch((error) => {
                let errorMessage = "An error occurred while fetching the user details!";
    
                if (error.response) {
                    if (error.response.status === 401) {
                        errorMessage = "You are not authorized to view this user's details.";
                    } else if (error.response.status === 404) {
                        errorMessage = "User not found.";
                    }
                } else if (error.message === "Network Error") {
                    errorMessage = "Unable to connect to the server. Please check your internet connection.";
                }
    
                toast.error(errorMessage);
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleGoBack = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <Container>
            <h1 style={{margin: "24px 0"}}>About the user:</h1>
            <CardContent>
                <p><b>Username:</b> {user?.username}</p>
                <p><b>Email: </b> {user?.email}</p>
                <p><b>Role:</b> {user?.role}</p>

                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" onClick={handleGoBack}>
                    <ArrowBackIcon style={{color: "white"}}/>
                    Go back
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/users/${userId}/edit`}>
                    <EditIcon style={{color: "white"}}/>
                    Edit user details
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/users/${userId}/delete`}>
                    <DeleteForeverIcon style={{color: "white"}}/>
                    Delete user
                </Button>
            </CardContent>
        </Container>
    );
};

export default UserDetailsPage;