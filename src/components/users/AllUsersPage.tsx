import { Link, useNavigate } from "react-router-dom";
import { customAxios } from "../../services/application.service";
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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from "@mui/icons-material/Add";
import ExtendedUser from "../../models/ExtendedUser";

const UsersPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<ExtendedUser[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0); 

    const fetchEntries = async (params: any) => {
        customAxios()
        .get("/users", { params })
        .then((response) => {
            setUsers(response.data.users);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        })
        .catch((error: any) => {
            if (error.response.status === 401) {
              navigate("/unauthorized");
            } else {
              toast.error("An error occurred while fetching entries");
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchEntries({ page: page });
    }, [page, pageSize]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Container>
        <h1>All users of the application:</h1>

        {loading && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
                <CircularProgress />
            </div>
        )}

        {users.length === 0 && !loading && <p>No users found!</p>}

        {!loading && (
            <IconButton
            component={Link}
            sx={{ marginBottom: 1 }}
            to="/users/add"
            >
                <AddIcon color="primary" />
            </IconButton>
        )}

        {users.length > 0 && (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">Operations</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell component="th" scope="row">
                                    {(page - 1) * pageSize + index + 1}
                                </TableCell>

                                <TableCell align="center">
                                    <Link to={`/users/${user.id}/details`} title="View user's details">
                                        {user.username}
                                    </Link>
                                </TableCell>

                                <TableCell align="center">{user.email}</TableCell>

                                <TableCell align="center">{user.role}</TableCell>

                                <TableCell align="center">
                                    <IconButton component={Link} to={`/users/${user.id}`} sx={{ marginRight: 3 }}>
                                        <InfoIcon />
                                    </IconButton>

                                    <IconButton component={Link} to={`/users/${user.id}/edit`} sx={{ marginRight: 3 }}>
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton component={Link} to={`/users/${user.id}/delete`}>
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

export default UsersPage;
