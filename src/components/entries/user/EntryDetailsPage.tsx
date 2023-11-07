import {Container, CardContent, Button} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { customAxios, formatTime } from "../../../services/application.service";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExtendedTimeEntry from "../../../models/ExtendedTimeEntry";

const EntryDetailsPage = () => {
    const navigate = useNavigate();

    const {entryId} = useParams();
    const [entry, setEntry] = useState<ExtendedTimeEntry>();

    useEffect(() => {
        customAxios()
            .get(`/time_entries/${entryId}`)
            .then((response) => {
                const entryData: ExtendedTimeEntry = response.data;
                setEntry(entryData);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized");
                } else {
                    toast.error("An error occurred while fetching the entry details!");
                }
            });
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
                <p><b>Traveled distance: </b> {entry?.distance} km</p>
                <p><b>The duration:</b> {formatTime(entry)}</p>

                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" onClick={handleGoBack}>
                    <ArrowBackIcon style={{color: "white"}}/>
                    Go back
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/entries/${entryId}/edit`}>
                    <EditIcon style={{color: "white"}}/>
                    Edit entry details
                </Button>
                <Button style={{margin: "10px 10px 0 0px"}} variant="contained" href={`/entries/${entryId}/delete`}>
                    <DeleteForeverIcon style={{color: "white"}}/>
                    Delete entry
                </Button>
            </CardContent>
        </Container>
    );
};

export default EntryDetailsPage;