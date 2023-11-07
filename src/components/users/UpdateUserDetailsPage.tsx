import { useEffect } from 'react';
import { Button, Grid, IconButton, InputLabel, MenuItem, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { customAxios } from '../../services/application.service';
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserUpdate from '../../models/UserUpdate';

const EditUserDetailsPage = () => {
    const navigate = useNavigate();

    const { userId } = useParams();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username is required')
            .max(25, 'Username must be at most 25 characters long'),
        email: Yup.string()
            .required('Email is required')
            .max(255, 'Email must be at most 255 characters long')
            .matches(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                'Invalid email address'
            ),
        role: Yup.string()
            .oneOf(["regular", "user_manager", "admin"], "Role is required"),
    });

    useEffect(() => {
        customAxios()
            .get(`/users/${userId}`)
            .then((response) => {
                formik.setValues({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error("Error fetching users: ", error);
                }
            });
    });

    const handleSubmit = (userUpdate: UserUpdate) => {
        customAxios()
            .put(`/users/${userId}`, {user: userUpdate})
            .then(() => {
                toast.success('User updated successfully!');
                navigate('/users');
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error('An error occurred while updating the user!');
                }
            });
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            role: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleGoBack = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <div>
            <h1>
                <IconButton onClick={handleGoBack} style={{ marginRight: 8 }}>
                    <ArrowBackIcon />
                </IconButton>
                Edit user:
            </h1>
            <ToastContainer />
            <Grid container justifyContent="center">
                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "500px",
                        width: "100%",
                        padding: "16px",
                        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onSubmit={formik.handleSubmit}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username && <div style={{ color: 'red' }}>{formik.errors.username}</div>}

                    <TextField
                        style={{ marginTop: 8 }}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}

                    <InputLabel htmlFor="role">Role</InputLabel>
                    <TextField
                        select
                        variant="outlined"
                        fullWidth
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value="regular">Regular</MenuItem>
                        <MenuItem value="user_manager">User manager</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    {formik.touched.role && formik.errors.role && <div style={{ color: 'red' }}>{formik.errors.role}</div>}

                    <Button
                        style={{ marginTop: 16 }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        UPDATE USER
                    </Button>
                </form>
            </Grid>
        </div>
    );
};

export default EditUserDetailsPage;
