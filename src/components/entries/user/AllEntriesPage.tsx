import { customAxios, formatTime } from "../../../services/application.service";
import { Link, useNavigate } from "react-router-dom";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Container,
  IconButton,
  Pagination,
  TextField,
  Button
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from "@mui/icons-material/Add";
import ExtendedTimeEntry from "../../../models/ExtendedTimeEntry";

const TimeEntriesPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState<ExtendedTimeEntry[]>([]);
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0); 

    const fetchEntries = async (params: any) => {
        customAxios()
        .get("/time_entries", { params })
        .then((response) => {
            setEntries(response.data.time_entries);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        })
        .catch((error: any) => {
            if (error.response.status === 401) {
              navigate("/unauthorized");
            } else {
              toast.error("An error occurred while fetching entries!");
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchEntries({ page: page, start_date: startDate, end_date: endDate });
    }, [page, pageSize]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleFilter = () => {
        setLoading(true);
        setPage(1); 
        fetchEntries({ page: page, start_date: startDate, end_date: endDate });
    };

    return (
        <Container>
        <h1>My time entries:</h1>

        <div style={{ marginBottom: '10px' }}>
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                sx={{ marginRight: 1 }}
                onChange={(e) => setStartDate(e.target.value)} 
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    placeholder: "YYYY-MM-DD",
                }}
            />

            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} 
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    placeholder: "YYYY-MM-DD",
                }}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleFilter}
                sx={{ marginLeft: 2, marginTop: 1, marginBottom: 1 }}
            >
                Filter
            </Button>
        </div>

        {loading && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
                <CircularProgress />
            </div>
        )}

        {entries.length === 0 && !loading && <p>No time entries found!</p>}

        {!loading && (
            <IconButton
            component={Link}
            sx={{ marginBottom: 1 }}
            to="/entries/add"
            >
                <AddIcon color="primary" />
            </IconButton>
        )}

        {entries.length > 0 && (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Distance</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="center">Operations</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {entries.map((entry, index) => (
                            <TableRow key={entry.id}>
                                <TableCell component="th" scope="row">
                                    {(page - 1) * pageSize + index + 1}
                                </TableCell>

                                <TableCell align="center">{entry.date}</TableCell>

                                <TableCell align="center">{entry.distance.toFixed(2)} km</TableCell>

                                <TableCell align="center">
                                    {formatTime(entry)}
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton component={Link} to={`/entries/${entry.id}`} sx={{ marginRight: 3 }}>
                                        <InfoIcon />
                                    </IconButton>

                                    <IconButton component={Link} to={`/entries/${entry.id}/edit`} sx={{ marginRight: 3 }}>
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton component={Link} to={`/entries/${entry.id}/delete`}>
                                        <DeleteForeverIcon sx={{ color: "red" }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    sx={{ display: 'flex', justifyContent: 'center' }} />
            </TableContainer>
        )}
            <ToastContainer position="top-right" autoClose={5000} />
        </Container>
    );
};

export default TimeEntriesPage;
