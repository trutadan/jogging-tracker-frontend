import {
    Container,
    Card,
    CardContent,
    IconButton,
    CardActions,
    Button,
  } from "@mui/material";
import { customAxios } from "../../services/application.service";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  
const DeleteUserForm = () => {
    const navigate = useNavigate();

    const { userId } = useParams();

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        customAxios()
            .delete(`/users/${userId}`)
            .then((response) => {
                toast.success(response.data.message);
                navigate("/users");
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized"); 
                } else {
                    toast.error("An error occurred while deleting the user!");
                }
            });
    };

    const handleGoBack = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
    <Container>
        <Card>
            <CardContent>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                </IconButton>
                Are you sure you want to delete this user? This cannot be undone!
            </CardContent>

            <CardActions>
                <Button onClick={handleDelete}>Delete it</Button>
                <Button onClick={handleGoBack}>Cancel</Button>
            </CardActions>
        </Card>
        <ToastContainer position="top-right" autoClose={5000} />
    </Container>
    );
};

  export default DeleteUserForm;