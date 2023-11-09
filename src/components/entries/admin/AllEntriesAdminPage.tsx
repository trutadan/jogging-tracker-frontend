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
  Autocomplete
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import {debounce} from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from "@mui/icons-material/Add";
import ExtendedTimeEntryWithUser from "../../../models/ExtendedTimeEntryWithUser";
import SimpleUser from "../../../models/SimpleUser";

type FetchEntriesParams = {
    page: number; 
    user_id: number; 
};

const TimeEntriesAdminPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [entries, setEntries] = useState<ExtendedTimeEntryWithUser[]>([]);
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(0);

    const fetchEntries = async (params: FetchEntriesParams) => {
        customAxios()
            .get("/time_entries/admin", { params })
            .then((response) => {
                setEntries(response.data.time_entries);
                setTotalPages(response.data.total_pages);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized");
                } else {
                    toast.error("An error occurred while fetching entries!");
                }
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchEntries({ page: page, user_id: selectedUserId });
    }, [page, selectedUserId]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const fetchUsers = async (query: string) => {
        const params = {
            query: query
        }

        customAxios()
            .get("/users/autocomplete", { params })
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized");
                } else {
                    toast.error("An error occurred while fetching users!");
                }
            });
    };

    const handleUserSelection = (value: SimpleUser | null) => {
        setSelectedUserId(value?.id || 0);
        setPage(1);
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchUsers, 500), []);

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    const handleInputChange = (value: string) => {
        debouncedFetchSuggestions(value);
    };

  return (
    <Container>
      <h1>All time entries:</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <Autocomplete
            options={users}
            getOptionLabel={(user) => user.username}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Search by user..." variant="outlined" />}
            filterOptions={(x) => x}
            onInputChange={(_event, value) => handleInputChange(value)}
            onChange={(_event, value) => handleUserSelection(value)}
        />
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <CircularProgress />
        </div>)
      }

      {entries.length === 0 && !loading && <p>No time entries found!</p>}

      {!loading && (
        <IconButton
          component={Link}
          sx={{ marginBottom: 1 }}
          to="/admin/entries/add"
        >
          <AddIcon color="primary" />
        </IconButton>)
      }

      {entries.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Distance</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Owner's username</TableCell>
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
                    <Link to={`/users/${entry.user_id}`} title="View user's details">
                      {entry.username}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton component={Link} to={`/admin/entries/${entry.id}`} sx={{ marginRight: 3 }}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton component={Link} to={`/admin/entries/${entry.id}/edit`} sx={{ marginRight: 3 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton component={Link} to={`/admin/entries/${entry.id}/delete`}>
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

export default TimeEntriesAdminPage;
