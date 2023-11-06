import {
    Container,
    Card,
    CardContent,
    IconButton,
    CardActions,
    Button,
  } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { customAxios } from "../../../services/application.service";
import { ToastContainer, toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  
const DeleteEntryForm = () => {
    const navigate = useNavigate();

    const { entryId } = useParams();

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        try {
            const response = await customAxios().delete(`/time_entries/${entryId}`);
            toast.success(response.data.message);
            navigate(-1);
        } catch (error: any) {
            if (error.response.status === 401) {
                navigate("/unauthorized"); 
            } else {
                toast.error("An error occurred while deleting the entry");
            }
        }
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
                Are you sure you want to delete this item? This cannot be undone!
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

  export default DeleteEntryForm;