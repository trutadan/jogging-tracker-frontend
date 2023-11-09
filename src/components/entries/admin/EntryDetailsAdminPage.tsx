import {Container, CardContent, Button} from "@mui/material";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { customAxios, formatTime } from "../../../services/application.service";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExtendedTimeEntryWithUser from "../../../models/ExtendedTimeEntryWithUser";

const EntryDetailsAdminPage = () => {
    const navigate = useNavigate();

    const { entryId } = useParams();
    const [entry, setEntry] = useState<ExtendedTimeEntryWithUser>();
    const [username, setUsername] = useState<string>("");

    const fetchEntry = async () => {
        customAxios()
            .get(`/time_entries/${entryId}`)
            .then((response) => {
                const entryData = response.data.time_entry ? response.data.time_entry : response.data;
                setEntry(entryData);
                setUsername(response.data.username);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized");
                } else {
                    toast.error("An error occurred while fetching the entry details!");
                }
            });
    };

    useEffect(() => {
        fetchEntry();
    }, []);

    const handleGoBack = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <Container>
            <h1 style={{margin: "24px 0"}}>About the time entry:</h1>
            <CardContent>
                <p><b>Entry date:</b> {entry?.date}</p>
                <p><b>Traveled distance:</b> {entry?.distance} km</p>
                <p><b>The duration:</b> {formatTime(entry)}</p>
                <p>
                    <b>Owner's username: </b>
                    <Link to={`/users/${entry?.user_id}`}>{username}</Link>
                </p>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" onClick={handleGoBack}>
                    <ArrowBackIcon style={{color: "white"}}/>
                    Go back
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/admin/entries/${entryId}/edit`}>
                    <EditIcon style={{color: "white"}}/>
                    Edit entry details
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/admin/entries/${entryId}/delete`}>
                    <DeleteForeverIcon style={{color: "white"}}/>
                    Delete entry
                </Button>
            </CardContent>
        </Container>
    );
};

export default EntryDetailsAdminPage;